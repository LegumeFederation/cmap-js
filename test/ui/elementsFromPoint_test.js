import {assert} from 'chai';
import '../../src/polyfill/index';

describe('elementsFromPoint polyfill', () => {
  it('function exists document.elementsFromPoint()', () => {
    assert(document.elementsFromPoint);
  });
  // note: cannot test elementsFromPoint any further, because it depends on
  // browser's native  elementFromPoint().
});
