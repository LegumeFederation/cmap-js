/**
  * BioMap
  *
  * SceneGraphNodeCanvas representing a biological map and its associated tracks
  *
  */

import {Bounds} from '../model/Bounds';
import {FeatureMark} from './FeatureMark';
import {MapBackbone} from './MapBackbone';
import {SceneGraphNodeCanvas} from './SceneGraphNodeCanvas';
import { Group }  from './SceneGraphNodeGroup';

export class BioMap extends SceneGraphNodeCanvas {

  constructor({bioMapModel, appState, layoutBounds}) {
    super({model:bioMapModel});
    this.model.visible = {
      start: this.model.coordinates.start,
      stop: this.model.coordinates.stop
    };
    // set up coordinate bounds for view scaling
    this.appState = appState;
    this.verticalScale = 1;
    this.backbone = null;
    this.featureMarks = [];
    this.featureLabels = [];
    // create some regular expressions for faster dispatching of events
    this._gestureRegex = {
      pan:   new RegExp('^pan'),
      pinch: new RegExp('^pinch'),
      tap:   new RegExp('^tap'),
      wheel: new RegExp('^wheel')
    };
    this._layout(layoutBounds);
  }

  /**
   * 
   * Re-implement lifecycle/gestrue components as needed to appease 
   * the items on the canvas. 
   *
   */


//  _onTap(evt) {
//    console.log('tap');
//    console.log(evt);
//    let sel = this.appState.selection.bioMaps;
//    let i = sel.indexOf(this);
//    if(i === -1) {
//      sel.push(this);
//    }
//    else {
//      sel.splice(i, 1);
//    }
//    m.redraw();
//    console.log(this.locMap.all());
//    this.markerGroup.locMap.search(
//      {minX: evt.srcEvent.layerX,
//       maxX: evt.srcEvent.layerX,
//       minY: evt.srcEvent.layerY-5,
//       maxY: evt.srcEvent.layerY+5
//      }).forEach(hit => { console.log( hit.data)});
//
//    PubSub.publish(selectedMap, {
//      evt: evt,
//      data: this.appState.selection.bioMaps
//    });
//    return true;
//  }
  /**
   * perform layout of backbone, feature markers, and feature labels.
   */
  /**
   *
   * Lifecycle of a layout change
   *  - Get new canvas bounds
   *  - Place backbone
   *  - Place groups (markers, QTLs, &c)
   *  - Update rbush trees
   *  - Update congruence map(s)
   */
  _layout(layoutBounds) {
    // TODO: calculate width based on # of SNPs in layout, and width of feature
    // labels
    console.log('layout BioMap');
    const width = Math.floor(100 + Math.random() * 200);
    this.children = [];
    this.domBounds = new Bounds({
      left: layoutBounds.left,
      top: layoutBounds.top,
      width: width,
      height: layoutBounds.height
    });
    // this.bounds (scenegraph) has the same width and height, but zero the
    // left/top because we are the root node in a canvas sceneGraphNode
    // heirarchy
    this.bounds = new Bounds({
      left: 0,
      top: 0,
      width: this.domBounds.width,
      height: this.domBounds.height
    });
    // note map backbone will use this.bounds for it's own layout
    this.backbone = new MapBackbone({ parent: this });
    this.addChild(this.backbone);
    this.backbone.locMap.insert({
      minX: this.backbone.globalBounds.left,
      minY: this.backbone.globalBounds.top,
      maxX: this.backbone.globalBounds.right,
      maxY: this.backbone.globalBounds.bottom,
      data: this.backbone
    });

    let markerGroup = new Group({parent:this.backbone});
    this.addChild(markerGroup);
    this.markerGroup = markerGroup;
    markerGroup.bounds = this.backbone.bounds;

    let filteredFeatures = this.model.features.filter( model => {
      return model.length <= 0.00001;
    });
    let fmData = [];
    this.featureMarks = filteredFeatures.map( model => {
      let fm = new FeatureMark({
        featureModel: model,
        parent: this.backbone,
        bioMap: this.model
      });
      markerGroup.addChild(fm);
      fmData.push({
        minY: fm.globalBounds.top,
        maxY: fm.globalBounds.bottom,
        minX: fm.globalBounds.left,
        maxX: fm.globalBounds.right,
        data:fm
      });
      return fm;
    });

    markerGroup.locMap.load(fmData);
    this.locMap.load(this.visible);
  }
}
