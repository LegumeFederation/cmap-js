import {expect} from 'chai';
import {DataSourceModel} from '../../src/model/DataSourceModel';

const config = require('../../cmap.json');

describe('DataSourceModel test', () => {

  it('constructor works', () => {
    config.sources.forEach( params => {
      const model = new DataSourceModel(params);
      expect(model).to.have.property('method')
        .that.is.a('string');
      expect(model).to.have.property('url')
        .that.is.a('string');
      expect(model).to.have.property('uniquePrefix')
        .that.is.a('string');
      expect(model).to.have.property('background')
        .that.is.a('boolean');
    });
  });

  // TODO: test the load() function which will cause an http fetch.

  it('deserialize works', () => {
    const model = new DataSourceModel(config.sources[0]);
    model.deserialize(data);
    expect(model).to.have.property('parseResult')
      .that.is.an('object');
    expect(model.parseResult.errors).to.be.empty;
    expect(model.parseResult.data).to.have.lengthOf(9);
  });

});

const data =
"map_name	map_start	map_stop	feature_start	feature_stop	feature_name	feature_type\n" +
"Pv01	0	69.6073	13.3417	13.3469	phavu.Phvul.001G073700	gene\n" +
"Pv01	0	69.6073	1.33705	1.34065	phavu.Phvul.001G011400	gene\n" +
"Pv01	0	69.6073	13.4007	13.4024	phavu.Phvul.001G073800	gene\n" +
"Pv01	0	69.6073	1.34167	1.34511	phavu.Phvul.001G011500	gene\n" +
"Pv01	0	69.6073	13.4293	13.4313	phavu.Phvul.001G073900	gene\n" +
"Pv01	0	69.6073	1.34743	1.35232	phavu.Phvul.001G011600	gene\n" +
"Pv01	0	69.6073	13.4815	13.5003	phavu.Phvul.001G074000	gene\n" +
"Pv01	0	69.6073	13.5095	13.5121	phavu.Phvul.001G074100	gene\n" +
"Pv01	0	69.6073	13.5127	13.52	phavu.Phvul.001G074200	gene\n"; 
