import './polyfills';
import { cmap } from './cmap';

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  // support commonjs loading, if it exists.
  module.exports = cmap;
}
else {
  // otherwise put cmap constructor in window global
  window.cmap = cmap;
}

// create a default instance of cmap to launch
let _cmap = new cmap();
console.log(`cmap v${_cmap.version}`);
