import o from "ospec";
import { AppModel } from '../../src/model/AppModel.js';

o.spec('AppModel test', function () {
  o('constructor works', function () {
    const model = new AppModel();
    o(model.hasOwnProperty('sources')).equals(true);
    o(Array.isArray(model.sources)).equals(true);
    o(model.hasOwnProperty('bioMaps')).equals(true);
    o(Array.isArray(model.bioMaps)).equals(true);
    o(model.hasOwnProperty('tools')).equals(true);
    o(typeof model.tools).equals('object');
    o(model.hasOwnProperty('selection')).equals(true);
    o(typeof model.selection).equals('object');
    o(model.hasOwnProperty('status')).equals(true);
    o(typeof model.status).equals('string');
    o(model.hasOwnProperty('busy')).equals(true);
    o(typeof model.busy).equals('boolean');
  });
});

  // TODO: the load() test fails because DataSourceModel tries to http fetch the
  // data files from URL. Setup an http server running in nodejs to complete
  // this test.

  // o('load() works', function (done) {
  //   const model = new AppModel();
  //   const promises = model.load(config);
  //   const p = Promise.all(promises);
  //   p.then(function() {
  //     done();
  //   }).catch(done);
  // });