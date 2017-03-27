import { expect } from 'chai';
import { Bounds } from '../src/util/Bounds';

describe('Bounds test', () => {
  let params = {
      top: 1,
      bottom: 11,
      left: 10,
      right: 20,
      width: 10,
      height: 10
  };
  it('constructor works', () => {
    let b = new Bounds(params);
    expect(b).eql(params);
  });
  it('ignores x and y properties from DOMRect', () => {
    let paramsWithExtras = Object.assign({ x: -1, y: -1 }, params);
    let b = new Bounds(paramsWithExtras);
    expect(b).eql(params);
  });
});
