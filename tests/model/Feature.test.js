import o from "ospec";
import mq from 'mithril-query';
import { Feature, featuresInCommon } from '../../src/model/Feature.js';

o.spec('Feature test', function () {
  let params = {
    source: {},
    coordinates: {
      start: 10,
      stop: 10
    },
    name: 'test feature',
    tags: ['hilite', 'etc'],
    aliases: ['foo', 'feature 123'],
  };

  o('constructor works', function () {
    let f = new Feature(params);
    o(f.source).deepEquals(params.source);
    o(f.coordinates).deepEquals(params.coordinates);
    o(f.name).equals(params.name);
    o(f.tags).deepEquals(params.tags);
    o(f.aliases).deepEquals(params.aliases);
  });
  

  o('length()', function () {
    let f = new Feature(params);
    o(f.length).equals(0);
    let p1 = Object.assign({}, params, {
      aliases: [],
      coordinates: { start: 100, stop: 142 }
    });
    f = new Feature(p1);
    o(f.length).equals(42);
  });

  o('featuresInCommon()', function () {
    let i, features1 = [], features2 = [];
    for (i = 1; i <= 10; i++) {
      let name = `feature ${i}`;
      let p1 = Object.assign({}, params, { name });
      features1.push(new Feature(p1));
    }
    for (i = 8; i <= 15; i++) {
      let name = `feature ${i}`;
      let p1 = Object.assign({}, params, { name });
      features2.push(new Feature(p1));
    }
    let res = featuresInCommon(features1, features2);
    o(res.length).equals(5);  // Update to the correct expected value
  });  

  o('featuresInCommon() with aliases', function () {
    let i, features1 = [], features2 = [];
    for (i = 1; i <= 10; i++) {
      let name = `feature ${i}`;
      let aliases = [`foo ${i}`, `bar ${i}`];
      let p = Object.assign({}, params, { name, aliases });
      features1.push(new Feature(p));
    }
    for (i = 8; i <= 15; i++) {
      let name = `misnamed feature xxx${i}`;
      let aliases = [`foo ${i}`, `bling ${i}`];
      let p = Object.assign({}, params, { name, aliases });
      features2.push(new Feature(p));
    }
    let res = featuresInCommon(features1, features2);
    o(res.length).equals(3);
  });
});
