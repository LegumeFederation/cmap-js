/**
 * BioMapConfiguration data model
 */
import m from 'mithril';

export class BioMapConfigModel {

  /**
   * create a BioMapConfigModel
   * @param url
   * @param method
   */

  constructor({url, method}) {
    this.url = url;
    this.method = method;
  }

  /**
   *
   */
  load() {
    return m.request(this);
  }
}

/**
 * Constant that defines the default configuration of cmap maps
 * when no other configuration information is present.
 *
 * @type {{backboneWidth: number, backboneColor: string, invert: boolean, markerColor: string, markerWeight: number, markerLabelSize: number, markerLabelFace: string, markerLabelColor: string, rulerWidth: number, rulerSpacing: number, rulerColor: string, rulerLabelFace: string, rulerLabelSize: number, rulerLabelColor: string, rulerPrecision: number, rulerSteps: number, trackWidth: number, trackSpacing: number, trackColor: string, trackLabelSize: number, trackLabelFace: string, trackLabelColor: string}}
 */

export const defaultConfig = {
  'backbone' : {
    'width' : 20,
    'fillColor' : '#fff6e8',
    'lineWeight' : 0,
    'lineColor' : 'black'
  },
  'ruler' : {
    'width' : 10,
    'padding' : 5,
    'fillColor' : 'aqua',
    'lineWeight' : 0,
    'lineColor' : 'black',
    'labelFace' : 'Nunito',
    'labelSize' : 12,
    'labelColor' : 'black',
    'innerLineWeight' : 1.0,
    'innerLineColor' : 'black',
    'precision' : 2,
    'steps' : 100
  },
  'track' : {
    'width' : 5,
    'padding' : 5,
    'fillColor' : '#636081',
    'lineWeight' : 0,
    'lineColor' : 'black',
    'labelFace' : 'Nunito',
    'labelSize' : 12,
    'labelColor' : 'black',
    'internalPadding' : '5'
  },
  'marker':{
    'lineWeight' : 1,
    'lineColor' : 'black',
    'labelFace' : 'Nunito',
    'labelSize' : 12,
    'labelColor' : 'black'
  },
  'Correspondence' : {

  },
  'manhattan' :{
    'width' : 2,
    'fillColor':'green',
    'lineWeight':1,
    'lineColor':'black',
    'labelFace' : 'Nunito',
    'labelSize' : 10,
    'labelColor' : 'black',
    'displayWidth' : 50,
    'featureLineWeight' : 3,
    'featureLineColor' : 'red',
    'rulerWeight' : 2,
    'rulerColor' : 'black',
    'rulerMajorMark':10,
    'rulerMinorMark':2,
  },
  'backboneWidth': 20,
  'backboneColor': '#fff6e8',
  'invert': false,
  'markerColor': 'black',
  'markerWeight': 1,
  'markerLabelSize': 12,
  'markerLabelFace': 'Nunito',
  'markerLabelColor': 'black',
  'rulerWidth': 10,
  'rulerSpacing': 5,
  'rulerColor': 'aqua',
  'rulerLabelFace': 'Nunito',
  'rulerLabelSize': 12,
  'rulerLabelColor': 'black',
  'rulerPrecision': 2,
  'rulerSteps': 100,
  'trackWidth': 5,
  'trackSpacing': 5,
  'trackColor': '#636081',
  'trackLabelSize': 12,
  'trackLabelFace': 'Nunito',
  'trackLabelColor': 'black'
};
