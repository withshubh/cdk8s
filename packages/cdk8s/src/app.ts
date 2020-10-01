import { Construct, Node, IConstruct } from 'constructs';
import * as fs from 'fs';
import { Chart } from './chart';
import * as path from 'path';
import { Yaml } from './yaml';
import { DependencyGraph } from './dependency';

export interface AppOptions {
  /**
   * The directory to output Kubernetes manifests.
   *
   * @default - CDK8S_OUTDIR if defined, otherwise "dist"
   */
  readonly outdir?: string;
}

/**
 * Represents a cdk8s application.
 */
export class App extends Construct {
  /**
   * The output directory into which manifests will be synthesized.
   */
  public readonly outdir: string;

  /**
   * Defines an app
   * @param options configuration options
   */
  constructor(options: AppOptions = { }) {
    super(undefined as any, '');
    this.outdir = options.outdir ?? process.env.CDK8S_OUTDIR ?? 'dist';
  }

  /**
   * Synthesizes all manifests to the output directory
   */
  public synth(): void {

    fs.mkdirSync(this.outdir, { recursive: true });

    // this is kind of sucky, eventually I would like the DependencyGraph
    // to be able to answer this question.
    const hasDependantCharts = resolveChartDependencies(this);

    const simpleManifestNamer = (chart: Chart) => `${Node.of(chart).uniqueId}.k8s.yaml`;
    const manifestNamer = hasDependantCharts ? (chart: Chart, index: number) => `${index.toString().padStart(4, '0')}-${simpleManifestNamer(chart)}` : simpleManifestNamer;

    const charts: IConstruct[] = new DependencyGraph(Node.of(this)).topology().filter(x => x instanceof Chart);

    const manifests: Map<string, any[]> = new Map<string, any[]>();

    let index = 0;
    for (const node of charts) {
      const chart: Chart = Chart.of(node);
      manifests.set(manifestNamer(chart, index++), chart.toJson());
    }

    // validate the app construct since it wasn't validated in chart.synth()
    const errors = this.onValidate();
    if (errors.length > 0) {
      const errorList = errors.map(e => `[${Node.of(this).path}] ${e}`).join('\n  ');
      throw new Error(`Validation failed with the following errors:\n  ${errorList}`);
    }

    // now we can write the manifests
    for (const [name, manifest] of manifests.entries()) {
      Yaml.save(path.join(this.outdir, name), manifest);
    }
  }

  private static of(c: IConstruct): App {

    const scope = Node.of(c).scope;

    if (!scope) {
      // the app is the only construct without a scope.
      return c as App;
    }

    return App.of(scope);
  }

}

function resolveChartDependencies(app: App) {

  let hasDependantCharts = false;

  for (const dep of Node.of(app).dependencies) {

    // create an explicit chart dependency from implicit construct dependencies
    const sourceChart = Chart.of(dep.source);
    const targetChart = Chart.of(dep.target);

    if (sourceChart !== targetChart) {
      Node.of(sourceChart).addDependency(targetChart);
      hasDependantCharts = true;
    }

  }

  return hasDependantCharts;
}
