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
  'backboneWidth' : 20,
  'backboneColor' : '#fff6e8',
  'markerColor' : 'black',
  'markerWeight': 1,
  'markerLabelSize' : 12,
  'markerLabelFace': 'Nunito',
  'markerLabelColor' : 'black',
  'rulerWidth' : 10 ,
  'rulerSpacing' : 5,
  'rulerColor' : 'aqua',
  'rulerLabelFace' : 'Nunito',
  'rulerLabelSize' : 12,
  'rulerLabelColor' : 'black',
  'rulerPrecision' : 2,
  'rulerSteps' : 100,
  'trackWidth' : 5,
  'trackSpacing' : 5,
  'trackColor' : '#636081',
  'trackLabelSize' : 12,
  'trackLabelFace' : 'Nunito',
  'trackLabelColor' : 'black'
  };
