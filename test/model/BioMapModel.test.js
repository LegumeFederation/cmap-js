import {expect} from 'chai';
import {BioMapModel} from '../../src/model/BioMapModel';

const params =  {
  name: 'Pv01',
  dsn: 'my_data_',
  uniqueName: 'my_data_Pv01',
  features: [],
  coordinates: { start: 42, stop: 142 }
};

describe('BioMapModel class', () => {

  it('constructor works', () => {
    const model = new BioMapModel(params);
    expect(model).to.have.property('uniqueName')
      .that.is.a('string');
    expect(model).to.have.property('name')
      .that.is.a('string');
    expect(model).to.have.property('dsn')
      .that.is.a('string');
    expect(model).to.have.property('features')
      .that.is.an('array');
    expect(model).to.have.property('coordinates')
      .that.is.an('object');
    expect(model.coordinates.start).to.equal(42);
    expect(model.coordinates.stop).to.equal(142);
  });

  it('length getter works', () => {
    const model = new BioMapModel(params);
    expect(model.length).to.equal(100);
  });

});
