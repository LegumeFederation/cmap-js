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

export const defaultConfig = {
  "backboneWidth" : 40,
  "backboneColor" : "#fff6e8",
  "markerColor" : "black",
  "markerWeight": 1,
  "markerLabelSize" : 12,
  "markerLabelFace": "Nunito",
  "markerLabelColor" : "black",
  "rulerWidth" : 10 ,
  "rulerSpacing" : 5,
  "rulerColor" : "aqua",
  "rulerLabelFace" : "Nunito",
  "rulerLabelSize" : 12,
  "rulerLabelColor" : "black",
  "rulerPrecision" : 2,

  
  "testItem":"PleaseIgnore"};
