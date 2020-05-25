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
}

export abstract class ImportBase {
  public abstract get moduleNames(): string[];
  protected abstract async generateTypeScript(code: CodeMaker, moduleName?: string): Promise<void>;

  public async import(options: ImportOptions) {
    const code = new CodeMaker();

    const outdir = path.resolve(options.outdir);
    await fs.mkdirp(outdir);
    const isTypescript = options.targetLanguage === Language.TYPESCRIPT
    const { moduleNamePrefix } = options;

    for (const name of this.moduleNames) {
      const fileName = moduleNamePrefix ? `${moduleNamePrefix}-${name}.ts` : `${name}.ts`;
      code.openFile(fileName);
      code.indentation = 2;
      await this.generateTypeScript(code, name);
      code.closeFile(fileName);

      if (isTypescript) {
        await code.save(outdir);
      } else {
        // this is not typescript, so we generate in a staging directory and harvest the code
        await withTempDir('importer', async () => {
          await code.save('.');

          await srcmak.srcmak('.', outdir, {
            entrypoint: fileName,
            pythonName: moduleNamePrefix ? `${moduleNamePrefix}.${name}` : name,
            modules: [
              'constructs',
              'cdk8s',
              '@types/node'
            ]
          });
        });

      }
    }
  }
}
