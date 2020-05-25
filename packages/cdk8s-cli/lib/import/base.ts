import * as fs from 'fs-extra';
import * as path from 'path';
import { CodeMaker } from 'codemaker';
import { withTempDir } from '../util';
import * as srcmak from 'jsii-srcmak';

export enum Language {
  TYPESCRIPT = 'typescript',
  PYTHON = 'python',
  DOTNET = 'dotnet',
  JAVA = 'java',
}

export const LANGUAGES = [ Language.TYPESCRIPT, Language.PYTHON ];

export interface ImportOptions {
  readonly moduleNamePrefix?: string;
  readonly targetLanguage: Language;
  readonly outdir: string;

  /**
   * Path to copy the output .jsii file.
   * @default - jsii file is not emitted
   */
  readonly outputJsii?: string;
}

export interface GenerateResult {
  readonly deps?: string[]; // a list of module names to link against
}

export abstract class ImportBase {
  public abstract get moduleNames(): string[];

  protected abstract async generateTypeScript(code: CodeMaker, moduleName?: string): Promise<GenerateResult>;

  public async import(options: ImportOptions) {
    const code = new CodeMaker();
    const outputJsii = options.outputJsii ? path.resolve(options.outputJsii) : undefined;

    const outdir = path.resolve(options.outdir);
    await fs.mkdirp(outdir);
    const isTypescript = options.targetLanguage === Language.TYPESCRIPT
    const { moduleNamePrefix } = options;

    for (const name of this.moduleNames) {
      const fileName = moduleNamePrefix ? `${moduleNamePrefix}-${name}.ts` : `${name}.ts`;
      code.openFile(fileName);
      code.indentation = 2;
      const result = await this.generateTypeScript(code, name);
      code.closeFile(fileName);

      if (isTypescript) {
        await code.save(outdir);
      } else {
        // this is not typescript, so we generate in a staging directory and harvest the code
        await withTempDir('importer', async () => {
          await code.save('.');

          // these are the module dependencies we compile against
          const deps = [
            '@types/node',
            ...result.deps || []
          ];

          const opts: srcmak.Options = {
            entrypoint: fileName,
            moduleDirs: deps.map(dep => path.dirname(require.resolve(`${dep}/package.json`))),
            outputJsii: outputJsii
          };

          if (options.targetLanguage === Language.PYTHON) {
            opts.pythonName = moduleNamePrefix ? `${moduleNamePrefix}.${name}` : name;
          }

          await srcmak.srcmak('.', outdir, opts);
        });

      }
    }
  }
}
