import * as prev from 'cdk8s-plus-17';

/**
 * Volume represents a named volume in a pod that may be accessed by any
 * container in the pod.
 *
 * Docker also has a concept of volumes, though it is somewhat looser and less
 * managed. In Docker, a volume is simply a directory on disk or in another
 * Container. Lifetimes are not managed and until very recently there were only
 * local-disk-backed volumes. Docker now provides volume drivers, but the
 * functionality is very limited for now (e.g. as of Docker 1.7 only one volume
 * driver is allowed per Container and there is no way to pass parameters to
 * volumes).
 *
 * A Kubernetes volume, on the other hand, has an explicit lifetime - the same
 * as the Pod that encloses it. Consequently, a volume outlives any Containers
 * that run within the Pod, and data is preserved across Container restarts. Of
 * course, when a Pod ceases to exist, the volume will cease to exist, too.
 * Perhaps more importantly than this, Kubernetes supports many types of
 * volumes, and a Pod can use any number of them simultaneously.
 *
 * At its core, a volume is just a directory, possibly with some data in it,
 * which is accessible to the Containers in a Pod. How that directory comes to
 * be, the medium that backs it, and the contents of it are determined by the
 * particular volume type used.
 *
 * To use a volume, a Pod specifies what volumes to provide for the Pod (the
 * .spec.volumes field) and where to mount those into Containers (the
 * .spec.containers[*].volumeMounts field).
 *
 * A process in a container sees a filesystem view composed from their Docker
 * image and volumes. The Docker image is at the root of the filesystem
 * hierarchy, and any volumes are mounted at the specified paths within the
 * image. Volumes can not mount onto other volumes
 */
export class Volume extends prev.Volume {}

/**
 * Options for the ConfigMap-based volume.
 */
export interface ConfigMapVolumeOptions extends prev.ConfigMapVolumeOptions {}

/**
 * Maps a string key to a path within a volume.
 */
export interface PathMapping extends prev.PathMapping {}

/**
 * Options for volumes populated with an empty directory.
 */
export interface EmptyDirVolumeOptions extends prev.EmptyDirVolumeOptions {}

/**
 * The medium on which to store the volume.
 */
export { EmptyDirMedium } from 'cdk8s-plus-17';
