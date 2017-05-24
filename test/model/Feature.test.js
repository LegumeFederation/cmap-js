import {expect} from 'chai';
import {Feature, featuresInCommon} from '../../src/model/Feature';

describe('Feature test', function() {
  let params = {
    name: 'test feature',
    tags: ['hilite', 'etc'],
    aliases: ['foo', 'feature 123'],
    coordinates: {
      start: 10,
      stop: 10
    }
  };

  it('constructor works', function() {
    let f = new Feature(params);
    expect(f).eql(params);
  });

  it('length()', function() {
    let f = new Feature(params);
    expect(f.length).to.equal(0);
    let p1 = Object.assign(params, {
      aliases: [],
      coordinates: { start: 100, stop: 142 }
    });
    f = new Feature(p1);
    expect(f.length).to.equal(42);
  });

  it('featuresInCommon()', function() {
    let i, features1 = [], features2 = [];
    for (i = 1; i <= 10; i++) {
      let name = `feature ${i}`;
      let p1 = Object.assign(params, { name });
      features1.push(new Feature(p1));
    }
    for (i = 8; i <= 15; i++) {
      let name = `feature ${i}`;
      let p1 = Object.assign(params, { name });
      features2.push(new Feature(p1));
    }
    let res = featuresInCommon(features1, features2);
    expect(res.length).to.equal(3);
  });

  it('featuresInCommon() with aliases', function() {
    let i, features1 = [], features2 = [];
    for (i = 1; i <= 10; i++) {
      let name = `feature ${i}`;
      let aliases = [`foo ${i}`, `bar ${i}`];
      let p = Object.assign(params, { name, aliases });
      features1.push(new Feature(p));
    }
    for (i = 8; i <= 15; i++) {
      let name = `misnamed feature xxx${i}`;
      let aliases = [`foo ${i}`, `bling ${i}`];
      let p = Object.assign(params, { name, aliases });
      features2.push(new Feature(p));
    }
    let res = featuresInCommon(features1, features2);
    expect(res.length).to.equal(3);
  });
});
