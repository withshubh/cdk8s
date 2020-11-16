import * as prev from 'cdk8s-plus-17';
import { IConfigMap } from './config-map';
import { SecretValue } from './secret';

/**
 * Options to specify an envionment variable value from a ConfigMap key.
 */
export interface EnvValueFromConfigMapOptions extends prev.EnvValueFromConfigMapOptions {}

/**
 * Options to specify an environment variable value from a Secret.
 */
export interface EnvValueFromSecretOptions extends prev.EnvValueFromSecretOptions {}

/**
 * Options to specify an environment variable value from the process environment.
 */
export interface EnvValueFromProcessOptions extends prev.EnvValueFromProcessOptions {}

/**
 * Utility class for creating reading env values from various sources.
 */
export class EnvValue {

  /**
   * Create a value by reading a specific key inside a config map.
   *
   * @param configMap - The config map.
   * @param key - The key to extract the value from.
   * @param options - Additional options.
   */
  public static fromConfigMap(configMap: IConfigMap, key: string, options: EnvValueFromConfigMapOptions = { }): EnvValue {
    return prev.EnvValue.fromConfigMap(configMap, key, options);
  }

  /**
   * Defines an environment value from a secret JSON value.
   *
   * @param secretValue The secret value (secrent + key)
   * @param options Additional options
   */
  public static fromSecretValue(secretValue: SecretValue, options: EnvValueFromSecretOptions = {}): EnvValue {
    return prev.EnvValue.fromSecretValue(secretValue, options);
  }

  /**
   * Create a value from the given argument.
   *
   * @param value - The value.
   */
  public static fromValue(value: string): EnvValue {
    return prev.EnvValue.fromValue(value);
  }

  /**
   * Create a value from a key in the current process environment.
   *
   * @param key - The key to read.
   * @param options - Additional options.
   */
  public static fromProcess(key: string, options: EnvValueFromProcessOptions = {}): EnvValue {
    return prev.EnvValue.fromProcess(key, options);
  }

  private constructor(public readonly value?: any, public readonly valueFrom?: any) {}
}

export { ImagePullPolicy } from 'cdk8s-plus-17';

/**
 * Properties for creating a container.
 */
export interface ContainerProps extends prev.ContainerProps {}

/**
 * A single application container that you want to run within a pod.
 */
export class Container extends prev.Container {}

/**
 * Options for mounts.
 */
export interface MountOptions extends prev.MountOptions {}

/**
 * Mount a volume from the pod to the container.
 */
export interface VolumeMount extends prev.VolumeMount {}

export { MountPropagation } from 'cdk8s-plus-17';
