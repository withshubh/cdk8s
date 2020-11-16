import * as prev from 'cdk8s-plus-17';

export { ServiceType } from 'cdk8s-plus-17';
export { Protocol } from 'cdk8s-plus-17';

/**
 * Properties for initialization of `Service`.
 */
export interface ServiceProps extends prev.ServiceProps {};

/**
 * An abstract way to expose an application running on a set of Pods as a network service.
 * With Kubernetes you don't need to modify your application to use an unfamiliar service discovery mechanism.
 * Kubernetes gives Pods their own IP addresses and a single DNS name for a set of Pods, and can load-balance across them.
 *
 * For example, consider a stateless image-processing backend which is running with 3 replicas. Those replicas are fungible—frontends do not care which backend they use.
 * While the actual Pods that compose the backend set may change, the frontend clients should not need to be aware of that,
 * nor should they need to keep track of the set of backends themselves.
 * The Service abstraction enables this decoupling.
 *
 * If you're able to use Kubernetes APIs for service discovery in your application, you can query the API server for Endpoints,
 * that get updated whenever the set of Pods in a Service changes. For non-native applications, Kubernetes offers ways to place a network port
 * or load balancer in between your application and the backend Pods.
 */
export class Service extends prev.Service {};

export interface ServicePortOptions extends prev.ServicePortOptions {};

/**
 * Definition of a service port.
 */
export interface ServicePort extends prev.ServicePort {}
