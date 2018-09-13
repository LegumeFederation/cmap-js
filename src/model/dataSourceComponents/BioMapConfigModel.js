/**
 * BioMapConfiguration data model
 */
import fetch from '../../util/fetch';

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
    return fetch(this);
  }
}

/**
 * Constant that defines the default configuration of cmap maps
 * when no other configuration information is present.
 *
 * @type {{backbone: {width: number, fillColor: string, lineWeight: number, lineColor: string}, ruler: {width: number, padding: number, fillColor: string, lineWeight: number, lineColor: string, labelFace: string, labelSize: number, labelColor: string, innerLineWeight: number, innerLineColor: string, precision: number, steps: number, side: string}, track: {width: number, padding: number, fillColor: string, lineWeight: number, lineColor: string, labelFace: string, labelSize: number, labelColor: string, internalPadding: string}, marker: {lineWeight: number, lineColor: string, labelFace: string, labelSize: number, labelStyle: string, labelColor: string, filter: Array}, manhattan: {width: number, fillColor: string, lineWeight: number, lineColor: string, labelFace: string, labelSize: number, labelStyle: string, labelColor: string, displayWidth: number, featureLineWeight: number, featureLineColor: string, rulerWeight: number, rulerColor: string, rulerMajorMark: number, rulerMinorMark: number, type: string}, qtl: {padding: number, width: number, fillColor: string[], labelSize: number, labelFace: string, labelColor: string, labelStyle: string, trackMinWidth: number, internalPadding: number, position: number, type: string}, invert: boolean}}
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
    'steps' : 100,
    'position': -1
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
    'labelStyle' : 'block',
    'labelColor' : 'black',
    'labelPosition': 1,
    'labelPadding' : 0,
    'filter' : [],
  },

  'manhattan' :{
    'width' : 2,
    'fillColor':'green',
    'lineWeight':1,
    'lineColor':'black',
    'labelFace' : 'Nunito',
    'labelSize' : 10,
    'labelStyle' : 'none',
    'labelColor' : 'black',
    'displayWidth' : 50,
    'featureLineWeight' : 3,
    'featureLineColor' : 'red',
    'rulerWeight' : 2,
    'rulerColor' : 'black',
    'rulerMajorMark':10,
    'rulerMinorMark':2,
    'type':'manhattan'
  },
  'qtl':{
    'padding' : 20,
    'width': 5,
    'fillColor': ['green'],
    'labelSize': 12,
    'labelFace': 'Nunito',
    'labelColor': 'black',
    'labelStyle': 'block',
    'trackMinWidth' : 50,
    'internalPadding': 5,
    'position' : 1,
    'type':'qtl'
  },
  'invert': false,
};
