import * as prev from 'cdk8s-plus-17';

export interface SecretProps extends prev.SecretProps {}

export interface ISecret extends prev.ISecret {}

/**
 * Represents a specific value in JSON secret.
 */
export interface SecretValue extends prev.SecretValue {}

/**
 * Kubernetes Secrets let you store and manage sensitive information, such as
 * passwords, OAuth tokens, and ssh keys. Storing confidential information in a
 * Secret is safer and more flexible than putting it verbatim in a Pod
 * definition or in a container image.
 *
 * @see https://kubernetes.io/docs/concepts/configuration/secret
 */
export class Secret extends prev.Secret {}
