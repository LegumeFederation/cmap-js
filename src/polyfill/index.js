/**
 * A polyfill is a type of shim that retrofits legacy browsers with modern
 * Javascript, HTML5, or CSS3 features.
 */

// adds Math.scale, fscale, clamp, radians, degrees
//import 'core-js/fn/math/clamp';

// adds elementsFromPoint
import './elementsFromPoint';

// add support for promises
import 'promise-polyfill/src/polyfill';

//add support for Object.values
import 'mdn-polyfills/Object.values';
//add support for Array.forEach
import 'core-js/fn/array/for-each';
//add support for Array.filter
import 'core-js/fn/array/filter';
//add support for Array.map
import 'core-js/fn/array/map';
//add support for typed Arrays
import 'core-js/fn/typed';