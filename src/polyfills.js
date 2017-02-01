// this Promise polyfill is recommended by whatwg-fetch
import Promise from 'promise-polyfill';
if (! window.Promise) {
  window.Promise = Promise;
}

// See performance note @ https://github.com/taylorhakes/promise-polyfill
import setAsap from 'setasap';
Promise._immediateFn = setAsap;

// See note about unhandled rejections @ https://github.com/taylorhakes/promise-polyfill
// Promise._unhandledRejectionFn = function(rejectError) {};

// https://github.com/github/fetch
import 'whatwg-fetch';

// infernojs uses object.assign, which does not exist in IE (tested with IE11)
import assign from 'es6-object-assign';
assign.polyfill(); // now Object.polyfill is defined
