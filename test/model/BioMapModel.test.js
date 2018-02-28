import {expect} from 'chai';
import {BioMapModel} from '../../src/model/BioMapModel';
import {DataSourceModel} from '../../src/model/DataSourceModel';

let model;
const params = {
  name: 'Pv01',
  features: [],
  coordinates: {start: 42, stop: 142},
  source: new DataSourceModel({id: 'test'})
};

describe('BioMapModel test', function () {
  it('constructor works', function () {
    model = new BioMapModel(params);
    expect(model).to.have.property('source')
      .that.is.an('object');
    expect(model).to.have.property('name')
      .that.is.a('string');
    expect(model).to.have.property('features')
      .that.is.an('array');
    expect(model).to.have.property('coordinates')
      .that.is.an('object');
    expect(model.coordinates.start).to.equal(42);
    expect(model.coordinates.stop).to.equal(142);
  });

  it('length getter works', function () {
    expect(model.length).to.equal(100);
  });

  it('uniqueName getter works', function () {
    expect(model).to.have.property('uniqueName')
      .that.is.a('string');
    expect(model.uniqueName).to.equal('test/Pv01');
  });
});
