// load mithrilQuery, because the AppModel is composed of DataSourceModel which
// will use m.request() to fetch data files.
import mq from '../ui/mithrilQuerySetup';
import {expect} from 'chai';
import {AppModel} from '../../src/model/dataSourceComponents/AppModel';

const config = require('../../cmap.json');

describe('AppModel test', function () {

  it('constructor works', function () {
    const model = new AppModel();
    expect(model).to.have.property('sources')
      .that.is.an('array');
    expect(model).to.have.property('bioMaps')
      .that.is.an('array');
    expect(model).to.have.property('tools')
      .that.is.an('object');
    expect(model).to.have.property('selection')
      .that.is.an('object');
    expect(model).to.have.property('status')
      .that.is.a('string');
    expect(model).to.have.property('busy')
      .that.is.a('boolean');
  });

  // TODO: the load() test fails because DataSourceModel tries to http fetch the
  // data files from URL. Setup an http server running in nodejs to complete
  // this test.

  // it('load() works', function() {
  //   const model = new AppModel();
  //   const promises = model.load(config);
  //   const p = Promise.all(promises);
  //   return p;
  // });
});
