import o from 'ospec';
import '../../src/polyfill/index.js';

o.spec('elementsFromPoint polyfill', function () {
  o('function exists document.elementsFromPoint()', function () {
    o(typeof document.elementsFromPoint).equals('function');
  });
});
