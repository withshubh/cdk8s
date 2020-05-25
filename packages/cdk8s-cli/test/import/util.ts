import { compile } from "jsii-srcmak";
import { promises as fs } from 'fs';
import { withTempDir } from "../../lib/util";
import { Language, ImportBase } from "../../lib/import/base";

export function expectImportMatchSnapshot(name: string, fn: () => ImportBase) {
  jest.setTimeout(60_000);

  test(name, async () => {
    await withTempDir('import-k8s', async () => {
      const workdir = '.';

      const importer = fn();

      await importer.import({
        outdir: workdir,
        targetLanguage: Language.TYPESCRIPT,
      });

      for (const moduleName of importer.moduleNames) {
        await compile(workdir, {
          entrypoint: `${moduleName}.ts`,
          modules: [
            'constructs',
            'cdk8s',
            '@types/node'
          ]
        });
      }
    
      const manifest = JSON.parse(await fs.readFile('.jsii', 'utf-8'));
      expect(manifest).toMatchSnapshot();
    });
  });
}