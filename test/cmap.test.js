import {CMAP} from '../src/CMAP';
import {assert} from 'chai';

describe('CMAP class', () => {
  it('constructor works', () => {
    let cmap = new CMAP();
    assert(cmap);
  });
});
