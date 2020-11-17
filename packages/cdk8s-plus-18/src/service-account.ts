import * as prev from 'cdk8s-plus-17';
import { Construct } from 'constructs';
import * as k8s17 from './imports/v17/k8s';
import * as k8s18 from './imports/v18/k8s';

/**
 * Properties for initialization of `ServiceAccount`.
 */
export interface ServiceAccountProps extends prev.ServiceAccountProps {
  readonly imagePullSecrets?: string[];
}

export interface IServiceAccount extends prev.IServiceAccount {}

/**
 * A service account provides an identity for processes that run in a Pod.
 *
 * When you (a human) access the cluster (for example, using kubectl), you are
 * authenticated by the apiserver as a particular User Account (currently this
 * is usually admin, unless your cluster administrator has customized your
 * cluster). Processes in containers inside pods can also contact the apiserver.
 * When they do, they are authenticated as a particular Service Account (for
 * example, default).
 *
 * @see https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account
 */
export class ServiceAccount extends prev.ServiceAccount {

  private readonly _props: ServiceAccountProps;

  constructor(scope: Construct, id: string, props: ServiceAccountProps = {}) {
    super(scope, id, props);
    this._props = props;
  }

  /**
   * @internal
   */
  public _spec(): k8s18.ServiceAccountOptions {
    const previousSpec: k8s17.ServiceAccountOptions = (prev.ServiceAccount.prototype as any)._spec.call(this);
    return {
      ...previousSpec,
      imagePullSecrets: this._props.imagePullSecrets?.map(s => {
        return { name: s };
      }),
    };
  }
}