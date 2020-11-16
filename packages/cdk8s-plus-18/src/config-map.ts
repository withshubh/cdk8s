import * as prev from 'cdk8s-plus-17';

/**
 * Properties for initialization of `ConfigMap`.
 */
export interface ConfigMapProps extends prev.ConfigMapProps {}

/**
 * Represents a config map.
 */
export interface IConfigMap extends prev.IConfigMap {}

/**
 * Options for `configmap.addDirectory()`
 */
export interface AddDirectoryOptions extends prev.AddDirectoryOptions {}

/**
 * ConfigMap holds configuration data for pods to consume.
 */
export class ConfigMap extends prev.ConfigMap {}
