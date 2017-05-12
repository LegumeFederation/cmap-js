/**
 * Data source model
 */
import m from 'mithril';
import parser from 'papaparse';

import {BioMapModel} from './BioMapModel';
import {Feature} from './Feature';

// TODO: implement filtering at data loading time

export class DataSourceModel {

  /**
   * create a DataSourceModel
   * @param Object params having the following properties:
   * @param String id - uniqueId string for the data source (required)
   * @param String method - HTTP method, get or post (required)
   * @param String url - HTTP URL (required)
   * @param Object data - query string parameters for the request (optional)
   */
  constructor({id, method, data, url, filters}) {
    this.id = id;
    this.method = method;
    this.data = data;
    this.url = url;
    this.filters = filters || [];
    this.background = true; // mithril not to redraw upon completion
  }

  /**
   * Load the data source with mithril request
   * @return Promise
   */
  load() {
    return m.request(this);
  }

  /**
   * Callback from mithril request(); instead of the default deserialization
   * which is JSON, use the papaparse library to parse csv or tab delimited
   * content.
   * @param String delimited text - csv or tsv
   */
  deserialize(data) {
    const res = parser.parse(data, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true
    });
    if(res.errors.length) {
      console.error(res.errors);
      alert(`There were parsing errors in ${this.url}, please see console.`);
    }
    // apply filters from config file
    res.data = res.data.filter( d => this.includeRecord(d) );
    this.parseResult = res;
  }

  /**
   * Check record against filters and return true for inclusion. All filters are
   * processed sequentially and the result is all or nothing, effectively like
   * SQL AND.
   *
   * @param Object d - key/value properies of 1 record
   * @return Boolean - true for include, false for exclude
   */
  includeRecord(d) {
    let hits = 0;
    this.filters.forEach( f => {
      let col = f.column;
      if(d.hasOwnProperty(col)) {
        let testVal = d[col];
        let match;
        if(f.operator === 'equals') {
          match = (testVal === f.value);
        }
        else if(f.operator === 'regex') {
          match = testVal.match(f.value);
        }
        if(f.not) {
          if(! match) ++hits;
        }
        else {
          if(match) ++hits;
        }
      }
    });
    return (hits === this.filters.length);
  }

  /**
   * bioMaps getter; return a mapping of the uniquified map name to
   * an instance of BioMapModel.
   *
   * @return Object - key: prefix + map_name -> val: BioMapModel instance
   */
  get bioMaps() {
    const res = {};
    try {
      this.parseResult.data.forEach( d => {
        if(! d.map_name) return;
        const uniqueMapName = `${this.id}/${d.map_name}`;
        if(! res[uniqueMapName]) {
          const model = new BioMapModel({
            source: this,
            name: d.map_name,
            features: [],
            coordinates: { start: d.map_start, stop: d.map_stop }
          });
          res[uniqueMapName] = model;
        }
        res[uniqueMapName].features.push(
          new Feature({
            name: d.feature_name,
            tags: [d.feature_type !== '' ? d.feature_type : null],
            // TODO: if there is more than one alias, how is it encoded? comma separated?
            aliases: d.feature_aliases !== '' ? [ d.feature_aliases ] : [],
            coordinates: { start: d.feature_start, stop: d.feature_stop }
          })
        );
      });
    } catch(e) {
      console.trace();
      console.error(e);
    }
    return res;
  }
}
