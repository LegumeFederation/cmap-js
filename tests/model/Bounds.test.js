import o from 'ospec';
import { Bounds } from '../../src/model/Bounds.js';


o.spec('Bounds test', function () {
  let params = {
    top: 1,
    bottom: 11,
    left: 10,
    right: 20,
    width: 10,
    height: 10
  };

  o('constructor works', function () {
    let b = new Bounds(params);
    o(b.top).equals(params.top);
    o(b.bottom).equals(params.bottom);
    o(b.left).equals(params.left);
    o(b.right).equals(params.right);
    o(b.width).equals(params.width);
    o(b.height).equals(params.height);
  });

  o('constructor calculates missing width, height', function () {
    let missingParams = Object.assign({}, params);
    delete missingParams.width;
    delete missingParams.height;
    let b = new Bounds(missingParams);
    o(b.width).equals(10);
    o(b.height).equals(10);
  });

  o('constructor calculates missing bottom, right', function () {
    let missingParams = Object.assign({}, params);
    delete missingParams.bottom;
    delete missingParams.right;
    let b = new Bounds(missingParams);
    o(b.bottom).equals(11);
    o(b.right).equals(20);
  });

  o('ignores x and y properties from DOMRect', function () {
    let paramsWithExtras = Object.assign({ x: -1, y: -1 }, params);
    let b = new Bounds(paramsWithExtras);
    o(b.x).equals(undefined);
    o(b.y).equals(undefined);
  });

  o('equals()', function () {
    let b1 = new Bounds(params);
    let b2 = new Bounds(params);
    o(Bounds.equals(b1, b2)).equals(true);
    o(b1.equals(b2)).equals(true);
    params.width = 7;
    b2 = new Bounds(params);
    o(b1.equals(b2)).equals(false);
  });

  o('equals() rounds to pixel', function () {
    let paramsWithExtras = Object.assign({ width: params.width + 0.1 }, params);
    let b1 = new Bounds(paramsWithExtras);
    let b2 = new Bounds(params);
    o(Bounds.equals(b1, b2)).equals(true);
    o(b1.equals(b2)).equals(true);
  });

  o('equals() handles nils', function () {
    let b = new Bounds(params);
    [null, undefined].forEach(nil => {
      o(Bounds.equals(nil, b)).equals(false);
      o(Bounds.equals(b, nil)).equals(false);
      o(Bounds.equals(nil, nil)).equals(false);
    });
  });

  o('emptyArea()', function () {
    let b = new Bounds({ top: 10, left: 10, width: 0, height: 0 });
    o(b.isEmptyArea).equals(true);
    b = new Bounds({ top: 10, left: 10, width: 100, height: 90 });
    o(b.isEmptyArea).equals(false);
    b = new Bounds({ top: 10, left: 10, width: 100, height: 0 });
    o(b.isEmptyArea).equals(true);
  });

  o('area()', function () {
    let b = new Bounds({ top: 10, left: 10, width: 100, height: 90 });
    o(b.area).equals(9000);
  });

  o('areaEquals()', function () {
    let b = new Bounds({ top: 10, left: 10, width: 10, height: 2 });
    let bp = new Bounds({ top: 10, left: 10, width: 5, height: 4 });
    o(Bounds.areaEquals(b, bp)).equals(true);
    o(b.areaEquals(bp)).equals(true);
  });

  o('areaEquals() handles nils', function () {
    let b = new Bounds(params);
    [null, undefined].forEach(nil => {
      o(Bounds.areaEquals(nil, b)).equals(false);
      o(Bounds.areaEquals(b, nil)).equals(false);
      o(Bounds.areaEquals(nil, nil)).equals(false);
    });
  });
});
