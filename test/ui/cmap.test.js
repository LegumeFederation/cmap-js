import './mithrilQuerySetup';
import {CMAP} from '../../src/ui/CMAP';
import {assert} from 'chai';

describe('CMAP class', function () {
  it('constructor works', function () {
    let cmap = new CMAP();
    assert(cmap);
  });
});
