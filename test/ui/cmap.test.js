import './mithrilQuerySetup';
import {CMAP} from '../../src/ui/CMAP';
import {assert} from 'chai';

describe('CMAP class', () => {
  it('constructor works', () => {
    let cmap = new CMAP();
    assert(cmap);
  });
});
