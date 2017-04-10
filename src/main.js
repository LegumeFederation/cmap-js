/**
 * main
 * Instantiate the CMAP class, and initialize it.
 * Also the entry point for javascript bundler.
 */


import './ui/css/cmap.css';
import {CMAP} from './CMAP';
import './developmentTooling';

// FIXME: this way of exposing the cmap object seems kind of clunky. For
// implementing a js api, maybe using rollup-plugin-multi-entry would be
// useful: https://github.com/rollup/rollup-plugin-multi-entry

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  // support commonjs loading, if it exists.
  module.exports = CMAP;
}
else {
  // otherwise put cmap constructor in window global
  window.cmap = CMAP;
}

// wait for DOM ready
// create a default instance of cmap to launch
const evtName = 'DOMContentLoaded';
const loadedHandler = () => {
  let _cmap = new CMAP();
  _cmap.init();
  document.removeEventListener(evtName, loadedHandler);
};
document.addEventListener('DOMContentLoaded', loadedHandler);
