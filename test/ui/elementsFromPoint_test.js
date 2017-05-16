import {assert} from 'chai';
import '../../src/polyfill/index';

describe('elementsFromPoint polyfill', () => {
  it('function exists document.elementsFromPoint()', () => {
    assert(document.elementsFromPoint);
  });
});
