import {expect, assert} from 'chai';
import {Bounds} from '../../src/model/Bounds';

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

  it('constructor calculates missing width, height', () => {
    let missingParams = Object.assign({}, params);
    delete missingParams.width;
    delete missingParams.height;
    let b = new Bounds(missingParams);
    expect(b.width).to.equal(10);
    expect(b.height).to.equal(10);
  });

  it('constructor calculates missing bottom, right', () => {
    let missingParams = Object.assign({}, params);
    delete missingParams.bottom;
    delete missingParams.right;
    let b = new Bounds(missingParams);
    expect(b.bottom).to.equal(11);
    expect(b.right).to.equal(20);
  });

  it('ignores x and y properties from DOMRect', () => {
    let paramsWithExtras = Object.assign({ x: -1, y: -1 }, params);
    let b = new Bounds(paramsWithExtras);
    expect(b).eql(params);
  });

  it('equals()', () => {
    let b1 = new Bounds(params);
    let b2 = new Bounds(params);
    assert(Bounds.equals(b1, b2));
    assert(b1.equals(b2));
    params.width = 7;
    b2 = new Bounds(params);
    assert(! b1.equals(b2));
  });

  it('equals() rounds to pixel', () => {
    let paramsWithExtras = Object.assign({ width: params.width + 0.1}, params);
    let b1 = new Bounds(paramsWithExtras);
    let b2 = new Bounds(params);
    assert(Bounds.equals(b1, b2));
    assert(b1.equals(b2));
  });

  it('equals() handles nils', () => {
    let b = new Bounds(params);
    [null, undefined].forEach( nil => {
      assert(! Bounds.equals(nil, b));
      assert(! Bounds.equals(b,   nil));
      assert(! Bounds.equals(nil, nil));
    });
  });

  it('emptyArea()', () => {
    let b = new Bounds({top: 10, left: 10, width: 0, height: 0});
    assert(b.isEmptyArea);
    b = new Bounds({top: 10, left: 10, width: 100, height: 90});
    assert(! b.isEmptyArea);
    b = new Bounds({top: 10, left: 10, width: 100, height: 0});
    assert(b.isEmptyArea);
  });

  it('area()', () => {
    let b = new Bounds({top: 10, left: 10, width: 100, height: 90});
    expect(b.area).to.equal(9000);
  });

  it('areaEquals()', () => {
    let b = new Bounds({top: 10, left: 10, width: 10, height: 2});
    let bp = new Bounds({top: 10, left: 10, width: 5, height: 4});
    assert(Bounds.areaEquals(b, bp));
    expect(b.areaEquals(bp));
  });

  it('areaEquals() rounds to pixel', () => {
    let b = new Bounds({top: 10, left: 10, width: 10.5, height: 2});
    let bp = new Bounds({top: 10, left: 10, width: 10, height: 2});
    expect(b.areaEquals(bp));
  });

  it('areaEquals() handles nils', () => {
    let b = new Bounds(params);
    [null, undefined].forEach( nil => {
      assert(! Bounds.areaEquals(nil, b));
      assert(! Bounds.areaEquals(b,   nil));
      assert(! Bounds.areaEquals(nil, nil));
    });
  });
});
