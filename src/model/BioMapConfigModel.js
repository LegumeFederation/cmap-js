/**
 * BioMapConfiguration data model
 */
import m from 'mithril';

export class BioMapConfigModel {

  /**
   * create a BioMapConfigModel
   */
  constructor( config ) {
    console.log("testing stuff",config);
    this.url = config.url;
    this.method = config.method;
    this.config = config;
  }

  load(){
    return m.request(this);
  }
}
