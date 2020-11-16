import * as prev from 'cdk8s-plus-17';

/**
 * Probe options.
 */
export interface ProbeOptions extends prev.ProbeOptions {}

/**
 * Options for `Probe.fromHttpGet()`.
 */
export interface HttpGetProbeOptions extends prev.HttpGetProbeOptions {}

/**
 * Options for `Probe.fromCommand()`.
 */
export interface CommandProbeOptions extends prev.CommandProbeOptions {}

/**
 * Probe describes a health check to be performed against a container to
 * determine whether it is alive or ready to receive traffic.
 */
export abstract class Probe extends prev.Probe {}
