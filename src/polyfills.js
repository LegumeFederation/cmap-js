// use Native promises, and polyfill for IE (test with IE11)
import Promise from 'native-promise-only'; // now window.Promise === Promise

// infernojs uses object.assign, which does not exist in IE (tested with IE11)
import assign from 'es6-object-assign';
assign.polyfill(); // now Object.polyfill is defined
