/**
 * topics
 * define constants for all PubSub message topics used by cmap
 */
export const selectedMap = 'selectedMap'; // the selected map (canvas) changed
export const reset = 'reset'; // reset button click
export const layout = 'layout'; // layout selection changed
export const dataLoaded = 'loaded'; // data finished loading, or was filtered/updated

// map removal: this means the bioMap objects sent in the message, were removed
// by user
export const mapRemoved = 'mapRemoved';
