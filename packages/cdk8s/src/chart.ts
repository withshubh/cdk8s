import { Construct, Node, IConstruct } from 'constructs';
import { ApiObject } from './api-object';
import { Names } from './names';
import { DependencyGraph } from './dependency';

export interface ChartOptions {
  /**
   * The default namespace for all objects defined in this chart (directly or
   * indirectly). This namespace will only apply to objects that don't have a
   * `namespace` explicitly defined for them.
   *
   * @default - no namespace is synthesized (usually this implies "default")
   */
  readonly namespace?: string;
}

export class Chart extends Construct {

  /**
   * Finds the chart in which a node is defined.
   * @param c a construct node
   */
  public static of(c: IConstruct): Chart {
    if (c instanceof Chart) {
      return c;
    }

    const parent = Node.of(c).scope as Construct;
    if (!parent) {
      throw new Error('cannot find a parent chart (directly or indirectly)');
    }

    return Chart.of(parent);
  }

  /**
   * The default namespace for all objects in this chart.
   */
  public readonly namespace?: string;

  constructor(scope: Construct, ns: string, options: ChartOptions = { }) {
    super(scope, ns);
    this.namespace = options.namespace;
  }

  /**
   * Generates a app-unique name for an object given it's construct node path.
   *
   * Different resource types may have different constraints on names
   * (`metadata.name`). The previous version of the name generator was
   * compatible with DNS_SUBDOMAIN but not with DNS_LABEL.
   *
   * For example, `Deployment` names must comply with DNS_SUBDOMAIN while
   * `Service` names must comply with DNS_LABEL.
   *
   * Since there is no formal specification for this, the default name
   * generation scheme for kubernetes objects in cdk8s was changed to DNS_LABEL,
   * since it’s the common denominator for all kubernetes resources
   * (supposedly).
   *
   * You can override this method if you wish to customize object names at the
   * chart level.
   *
   * @param apiObject The API object to generate a name for.
   */
  public generateObjectName(apiObject: ApiObject) {
    return Names.toDnsLabel(Node.of(apiObject).path);
  }

  /**
   * Create a dependency between this Chart and other constructs.
   * These can be other ApiObjects, Charts, or custom.
   *
   * @param dependencies the dependencies to add.
   */
  public addDependency(...dependencies: IConstruct[]) {
    Node.of(this).addDependency(...dependencies);
  }

  /**
   * Synthesize a single chart.
   *
   * Each element returned in the resulting array represents a different ApiObject
   * in the scope of the chart.
   *
   * Note that the returned array order is important. It is determined by the various dependencies between
   * the constructs in the chart, where the first element is the one without dependencies, and so on...
   *
   * @returns An array of JSON objects.
   */
  public toJson(): any[] {

    for (const dep of Node.of(this).dependencies) {

      // create explicit api object dependencies from implicit construct dependencies
      const targetApiObjects = Node.of(dep.target).findAll().filter(c => c instanceof ApiObject);
      const sourceApiObjects = Node.of(dep.source).findAll().filter(c => c instanceof ApiObject);

      for (const target of targetApiObjects) {
        for (const source of sourceApiObjects) {
          Node.of(source).addDependency(target);
        }
      }

    }

    // Note this is a copy-paste of https://github.com/aws/constructs/blob/master/lib/construct.ts#L438.
    const errors = Node.of(this).validate();
    if (errors.length > 0) {
      const errorList = errors.map(e => `[${Node.of(e.source).path}] ${e.message}`).join('\n  ');
      throw new Error(`Validation failed with the following errors:\n  ${errorList}`);
    }

    return new DependencyGraph(Node.of(this)).topology()
      .filter(x => x instanceof ApiObject)
      .map(x => (x as ApiObject).toJson());

  }

}

