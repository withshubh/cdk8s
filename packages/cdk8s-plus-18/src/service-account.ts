import * as prev from 'cdk8s-plus-17';

/**
 * Properties for initialization of `ServiceAccount`.
 */
export interface ServiceAccountProps extends prev.ServiceAccountProps {}

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
export class ServiceAccount extends prev.ServiceAccount {}