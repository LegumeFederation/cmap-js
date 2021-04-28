/**
 * defaultConfig
 * Default settings for drawing CMAP maps
 * @type {{invert: boolean, marker: {filter: [], labelFace: string, labelSize: number, labelPadding: number, labelPosition: number, lineWeight: number, labelStyle: string, lineColor: string, labelColor: string}, manhattan: {featureLineWeight: number, rulerMajorMark: number, featureLineColor: string, lineColor: string, type: string, labelColor: string, fillColor: string, labelFace: string, rulerColor: string, labelSize: number, rulerWeight: number, displayWidth: number, rulerMinorMark: number, lineWeight: number, width: number, labelStyle: string}, qtl: {fillColor: [string], padding: number, labelFace: string, labelSize: number, trackMinWidth: number, width: number, labelStyle: string, internalPadding: number, position: number, type: string, labelColor: string}, backbone: {fillColor: string, lineWeight: number, width: number, lineColor: string}, ruler: {padding: number, innerLineColor: string, precision: number, lineColor: string, steps: number, labelColor: string, fillColor: string, labelFace: string, labelSize: number, innerLineWeight: number, lineWeight: number, width: number, position: number}, track: {fillColor: string, padding: number, labelFace: string, labelSize: number, lineWeight: number, width: number, internalPadding: string, lineColor: string, labelColor: string}}}
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
    'labelPosition': 1,
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
    'labelStyle': 'feature',
    'labelPosition': 1,
    'trackMinWidth' : 50,
    'internalPadding': 5,
    'position' : 1,
    'type':'qtl'
  },
  'invert': false,
};