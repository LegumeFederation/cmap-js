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
   * @param String method - HTTP method, get or post (required)
   * @param String url - HTTP URL (required)
   * @param String uniquePrefix - namespace or identifier to prefix (required)
   * @param Object data - query string parameters for the request (optional)
   */
  constructor({method, data, url, uniquePrefix}) {
    this.method = method;
    this.data = data;
    this.url = url;
    this.uniquePrefix = uniquePrefix;
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
    let modelMap = {};
    this.parseResult.data.forEach( d => {
      if(! d.map_name) return;
      let uniqueMapName = `${this.uniquePrefix}${d.map_name}`;
      if(! modelMap[uniqueMapName]) {
        modelMap[uniqueMapName] = new BioMapModel({
          uniqueName: uniqueMapName,
          dsn: this.uniquePrefix,
          name: d.map_name,
          features: [],
          coordinates: { start: d.map_start, stop: d.map_stop }
        });
      }
      modelMap[uniqueMapName].features.push(
        new Feature({
          name: d.feature_name,
          tags: [d.feature_type !== '' ? d.feature_type : null],
          // TODO: if there is more than one alias, how is it encoded? comma separated?
          aliases: d.feature_aliases !== '' ? [ d.feature_aliases ] : [],
          coordinates: { start: d.feature_start, stop: d.feature_stop }
        })
      );
    });
    return modelMap;
  }

}
