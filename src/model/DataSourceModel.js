/**
 * Data source model
 */
import m from 'mithril';
import parser from 'papaparse';

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
    this.parseResult = parser.parse(data, { header: true });
    console.log(this.parseResult);
  }

}
