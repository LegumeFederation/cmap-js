import o from 'ospec';
import config from '../../cmap.json' with { type: 'json' };
import { DataSourceModel } from '../../src/model/DataSourceModel.js';
import parser from 'papaparse';

o.spec('DataSourceModel test', function () {
  o('constructor works', function () {
    config.sources.forEach(params => {
      const model = new DataSourceModel(params);
      o(Object.prototype.hasOwnProperty.call(model, 'method')).equals(true);
      o(typeof model.method).equals('string');
      o(Object.prototype.hasOwnProperty.call(model, 'url')).equals(true);
      o(typeof model.url).equals('string');
      o(Object.prototype.hasOwnProperty.call(model, 'id')).equals(true);
      o(typeof model.id).equals('string');
      o(Object.prototype.hasOwnProperty.call(model, 'background')).equals(true);
      o(typeof model.background).equals('boolean');
    });
  });

  o('deserialize works', function () {
    const model = new DataSourceModel(config.sources[0]);
    const res = parser.parse(data, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true
    });
    model.parseResult = res;
    o(Object.prototype.hasOwnProperty.call(model, 'parseResult')).equals(true);
    o(typeof model.parseResult).equals('object');
    o(model.parseResult.errors.length).equals(0);
    o(model.parseResult.data.length).equals(9);
  });

  o('includeRecord equals', function () {
    let model;
    config.sources[1].filters = [{
      column: 'feature_type',
      operator: 'equals',
      value: 'gene_test'
    }];
    model = new DataSourceModel(config.sources[1]);
    const res = parser.parse(data, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true
    });
    res.data = res.data.filter(d => model.includeRecord(d));
    model.parseResult = res;
    o(model.parseResult.errors.length).equals(0);
    o(model.parseResult.data.length).equals(1);
  });

  // other tests...
});

const data = `
map_name	map_start	map_stop	feature_start	feature_stop	feature_name	feature_type
Pv01	0	69.6073	13.3417	13.3469	phavu.Phvul.001G073700	gene
Pv01	0	69.6073	1.33705	1.34065	phavu.Phvul.001G011400	gene
Pv01	0	69.6073	13.4007	13.4024	phavu.Phvul.001G073800	gene
Pv01	0	69.6073	1.34167	1.34511	phavu.Phvul.001G011500	gene
Pv01	0	69.6073	13.4293	13.4313	phavu.Phvul.001G073900	gene
Pv01	0	69.6073	1.34743	1.35232	phavu.Phvul.001G011600	gene
Pv01	0	69.6073	13.4815	13.5003	phavu.Phvul.001G074000	gene
Pv01	0	69.6073	13.5095	13.5121	phavu.Phvul.001G074100	gene_test
Pv01	0	69.6073	13.5127	13.52	phavu.Phvul.001G074200	xyz_test
`.trim();
