/**
 * Data source model
 */
import m from 'mithril';
import parser from 'papaparse';

import {BioMapModel} from './BioMapModel';
import {Feature} from './Feature';
import {BioMapConfigModel} from './BioMapConfigModel';

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
  constructor({id, method, data, url, filters, linkouts,config}) {
    this.id = id;
    this.method = method;
    this.data = data;
    this.url = url;
    this.config = config || {"test":"ignore"};
    (( )  => {
      console.log('testing stuff', this.config);
      let cfg = new BioMapConfigModel(this.config);
      console.log('testing stuff',cfg)
      return cfg.load();
    })().then((item)=>{
      this.bioConfig = item;
    });

    this.filters = filters || [];
    this.linkouts = linkouts || [];
    this.linkouts.forEach(l => {l.featuretypePattern != undefined ? l.featuretypePattern = new RegExp(l.featuretypePattern) : undefined;});
    this.background = true; // mithril not to redraw upon completion
    console.log("testing conf", this.config);
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
    console.log('testing stuff bc',this.bioConfig);
    const res = {};
      try {
        let typeField = this.parseResult.meta.fields.includes('feature_type') ? 'feature_type' : 'feature_type_acc';
        this.parseResult.data.forEach( d => {
          if(! d.map_name) return;
          const uniqueMapName = `${this.id}/${d.map_name}`;
          if(! res[uniqueMapName]) {
            const model = new BioMapModel({
              source: this,
              name: d.map_name,
              features: [],
              tags: [],
              coordinates: { start: d.map_start, stop: d.map_stop },
              config: this.bioConfig[d.map_name] || this.bioConfig.default
            });
            res[uniqueMapName] = model;
          }
          else {
              if (d.map_stop > res[uniqueMapName].coordinates.stop) {
                  res[uniqueMapName].coordinates.stop = d.map_stop;
              }
          }
          res[uniqueMapName].features.push(
            new Feature({
              source : this,
              name: d.feature_name,
              tags: [d[typeField] !== '' ? d[typeField] : null],
              // TODO: if there is more than one alias, how is it encoded? comma separated?
              aliases: d.feature_aliases !== '' ? [ d.feature_aliases ] : [],
              coordinates: { start: d.feature_start, stop: d.feature_stop }
            })
          );
          if(d[typeField] !== '' && res[uniqueMapName].tags.indexOf(d[typeField]) === -1){
            res[uniqueMapName].tags.push(d[typeField]);
          }
        });
        Object.keys(res).forEach( key => {
         console.log('tags', res[key].tags);
        });
      } catch(e) {
        console.trace();
        console.error(e);
      }
      console.log('testing stuff res',res);
      return res;
  }
}
