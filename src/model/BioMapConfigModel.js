/**
 * BioMapConfiguration data model
 */
import m from 'mithril';

export class BioMapConfigModel {

  /**
   * create a BioMapConfigModel
   */
  constructor({url, method} ) {
    this.url = url;
    this.method = method;
  }

  load(){
    return m.request(this);
  }
}

export const defaultConfig = {"rulerColor":"aqua","testItem":"PleaseIgnore"};
