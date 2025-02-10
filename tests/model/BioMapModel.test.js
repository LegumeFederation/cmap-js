import o from 'ospec';
import { BioMapModel } from '../../src/model/BioMapModel.js';
import { DataSourceModel } from '../../src/model/DataSourceModel.js';

let model;
const params = {
  name: 'Pv01',
  features: [],
  coordinates: { start: 42, stop: 142 },
  source: new DataSourceModel({ id: 'test' })
};

o.spec('BioMapModel test', function () {
  o('constructor works', function () {
    model = new BioMapModel(params);
    o(Object.prototype.hasOwnProperty.call(model, 'source')).equals(true);
    o(model.source).equals(params.source);
    o(Object.prototype.hasOwnProperty.call(model, 'name')).equals(true);
    o(model.name).equals(params.name);
    o(Object.prototype.hasOwnProperty.call(model, 'features')).equals(true);
    o(Array.isArray(model.features)).equals(true);
    o(Object.prototype.hasOwnProperty.call(model, 'coordinates')).equals(true);
    o(model.coordinates).deepEquals(params.coordinates);
    o(model.coordinates.start).equals(42);
    o(model.coordinates.stop).equals(142);
  });

  o('length getter works', function () {
    o(model.length).equals(100);
  });

  o('uniqueName getter works', function () {
    o(model.uniqueName).equals('test/Pv01');
  });
});
