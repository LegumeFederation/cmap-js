/**
 * @file
 * Instantiate the CMAP class, and initialize it.
 * Also the entry point for bundling of javascript and css.
 */
/* polyfills and utilities */
import './polyfill/index';
//import './developmentTooling';
import './util/concatAll';
/* css */
import '../node_modules/normalize.css/normalize.css';
import '../node_modules/skeleton-css/css/skeleton.css';
import './ui/css/cmap.css';

//import {h, render} from 'preact';
import { h, render} from 'preact';
import UI from './ui';


render( <UI />, document.querySelector('#cmap-div'));


