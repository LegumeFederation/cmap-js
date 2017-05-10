/**
 * Data source model
 */
import m from 'mithril';
import parser from 'papaparse';

import {BioMapModel} from './BioMapModel';
import {Feature} from './Feature';


export class DataSourceModel {

  /**
   * create a DataSourceModel
   * @param Object params having the following properties:
   * @param String id - uniqueId string for the data source (required)
   * @param String method - HTTP method, get or post (required)
   * @param String url - HTTP URL (required)
   * @param Object data - query string parameters for the request (optional)
   */
  constructor({id, method, data, url}) {
    this.id = id;
    this.method = method;
    this.data = data;
    this.url = url;
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
    this.parseResult = parser.parse(data, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true
    });
    if(this.parseResult.errors.length) {
      console.error(this.parseResult.errors);
      alert(`There were parsing errors in ${this.url}, please see console.`);
    }
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
        const uniqueMapName = `{this.id}/${d.map_name}`;
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
