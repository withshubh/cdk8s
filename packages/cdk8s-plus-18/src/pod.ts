import * as prev from 'cdk8s-plus-17';

/**
 * Represents a resource that can be configured with a kuberenets pod spec. (e.g `Deployment`, `Job`, `Pod`, ...).
 *
 * Use the `PodSpec` class as an implementation helper.
 */
export interface IPodSpec extends prev.IPodSpec {}

/**
 * Represents a resource that can be configured with a kuberenets pod template. (e.g `Deployment`, `Job`, ...).
 *
 * Use the `PodTemplate` class as an implementation helper.
 */
export interface IPodTemplate extends prev.IPodTemplate {}

/**
 * Provides read/write capabilities ontop of a `PodSpecProps`.
 */
export class PodSpec extends prev.PodSpec {}

/**
 * Properties of a `PodTemplate`.
 *
 * Adds metadata information on top of the spec.
 */
export interface PodTemplateProps extends prev.PodTemplateProps {}

/**
 * Provides read/write capabilities ontop of a `PodTemplateProps`.
 */
export class PodTemplate extends prev.PodTemplate {}

/**
 * Properties for initialization of `Pod`.
 */
export interface PodProps extends prev.PodProps {}

/**
 * Properties of a `PodSpec`.
 */
export interface PodSpecProps extends prev.PodSpecProps {}

/**
 * Pod is a collection of containers that can run on a host. This resource is
 * created by clients and scheduled onto hosts.
 */
export class Pod extends prev.Pod {}

export { RestartPolicy } from 'cdk8s-plus-17';

