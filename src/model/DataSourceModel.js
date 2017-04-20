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
   * @param Object params having the following properties
   * @param String HTTP method (GET, POST)
   * @param String URL
   */
  constructor({method, data, url}) {
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
      dynamicTyping: true
    });
  }

  /**
   * bioMaps getter
   *
   * @return Object - key: map_name val: BioMapModel instance
   */
  get bioMaps() {
    let modelMap = {};
    this.parseResult.data.forEach( d => {
      if(! d.map_name) return;
      if(! modelMap[d.map_name]) {
        modelMap[d.map_name] = new BioMapModel({
          name: d.map_name,
          features: [],
          coordinates: { start: d.map_start, stop: d.map_stop }
        });
      }
      modelMap[d.map_name].features.push(
        new Feature({
          name: d.feature_name,
          tags: [d.feature_type],
          coordinates: { start: d.feature_start, stop: d.feature_stop }
        })
      );
    });
    return modelMap;
  }

}
