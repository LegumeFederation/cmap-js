/**
 * main
 * Instantiate the CMAP class, and initialize it.
 * Also the entry point for bundling of javascript and css.
 */
import '../node_modules/normalize.css/normalize.css';
import '../node_modules/skeleton-css/css/skeleton.css';
import './ui/css/cmap.css';

import './polyfill/index';
import './developmentTooling';
import {CMAP} from './CMAP';

/* istanbul ignore next: unable to test this module because of css imports */
const main = () => {
  // FIXME: this way of exposing the cmap object seems kind of clunky. For
  // implementing a js api, maybe using this rollup plugin would be
  // useful: https://github.com/rollup/rollup-plugin-multi-entry
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    // support commonjs loading, if it exists.
    module.exports = CMAP;
  }
  else {
    // otherwise put cmap constructor in window global
    window.cmap = CMAP;
  }
  const evtName = 'DOMContentLoaded';
  const loadedHandler = () => {
    let _cmap = new CMAP();
    _cmap.init();
    document.removeEventListener(evtName, loadedHandler);
  };
  document.addEventListener(evtName, loadedHandler);
};

main();
