import o from 'ospec';
import { AppModel } from '../../src/model/AppModel.js';

o.spec('AppModel test', function () {
  o('constructor works', function () {
    const model = new AppModel();
    o(Object.prototype.hasOwnProperty.call(model, 'sources')).equals(true);
    o(Array.isArray(model.sources)).equals(true);
    o(Object.prototype.hasOwnProperty.call(model, 'bioMaps')).equals(true);
    o(Array.isArray(model.bioMaps)).equals(true);
    o(Object.prototype.hasOwnProperty.call(model, 'tools')).equals(true);
    o(typeof model.tools).equals('object');
    o(Object.prototype.hasOwnProperty.call(model, 'selection')).equals(true);
    o(typeof model.selection).equals('object');
    o(Object.prototype.hasOwnProperty.call(model, 'status')).equals(true);
    o(typeof model.status).equals('string');
    o(Object.prototype.hasOwnProperty.call(model, 'busy')).equals(true);
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
