import {assert} from 'chai';
import '../../src/polyfill/index';

describe('elementsFromPoint polyfill', function() {
  it('function exists document.elementsFromPoint()', function() {
    assert(document.elementsFromPoint);
  });
});
