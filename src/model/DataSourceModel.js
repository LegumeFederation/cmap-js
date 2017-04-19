/**
 * Data source model
 */
import m from 'mithril';

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
    this.background = true;
  }

  /**
   * Load the data source with http
   * @return Promise
   */
  load() {
    return m.request(this);
  }

  deserialize(data) {
    this.data = data;
    // TODO: parse cmap format!
  }
}
