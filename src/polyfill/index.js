/**
 * A polyfill is a type of shim that retrofits legacy browsers with modern
 * Javascript, HTML5, or CSS3 features.
 */

// adds Math.scale, fscale, clamp, radians, degrees
import 'ecma-proposal-math-extensions';

// adds elementsFromPoint
import './elementsFromPoint.js';
