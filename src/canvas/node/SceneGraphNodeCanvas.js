/**
 * SceneGraphNodeCanvas
 * Mithril component representing a html5 canvas element.
 *
 */

//import m from 'mithril';
//import PubSub from 'pubsub-js';
//import Hammer from 'hammerjs';
//
//import {mix} from '../../../mixwith.js/src/mixwith';
//
//import {DrawLazilyMixin} from '../DrawLazilyMixin';
//import {RegisterComponentMixin} from '../../ui/RegisterComponentMixin';
//import {selectedMap} from '../../topics';

import {SceneGraphNodeBase} from './SceneGraphNodeBase';
import {observe} from 'mobx';
import RBush from 'rbush';
export class SceneGraphNodeCanvas extends SceneGraphNodeBase {

  /**
   *
   * @param bounds
   * @param canvas
   * @param rotation
   * @param tags
   * @param data
   * @param config
   * @param view
   */

  constructor({ stateStore: stateStore, rotation: rotation = 0, tags: tags = [],} ) {
    super({
      parent:undefined,
      bounds: stateStore.bounds,
      rotation:rotation,
      tags:tags,
      view: stateStore.view
    });
    this.stateStore = stateStore;
    this.setCanvas(stateStore.canvas);
    this.config = stateStore.config;
    this.verticalScale = 1;
    this.data = stateStore.bioMap.features;
    this.view = stateStore.view;
    this.updateBounds(stateStore.bounds);
    // setup observers to update properties in BioMapState
    observe( stateStore, 'view', change =>{ this.updateView(change.newValue);});
    observe( stateStore, 'bounds', change=>{this.updateBounds(change.newValue);});
  }

  setCanvas(cvs) {
    this.canvas = cvs;
    this.context2d = cvs.getContext('2d');
  }

  setDomBounds(bounds) {
    this.domBounds = bounds;
    this.layout();
  }

  updateBounds(bounds){
    this.bounds = bounds;
    this.layout();
  }

  updateBoundsWidth(width){
    this.bounds.width = width;
  }

  /**
   * draw our scene graph children on canvas element
   */

  draw() {
    let ctx = this.context2d;
    if (!ctx) return;
    if (!this.canvasBounds) return;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.save();
    //ctx.translate(0.5, 0.5); // prevent subpixel rendering of 1px lines
    this.children.map(child => {
      child && child.draw(ctx);
    });
    ctx.restore();
    // store these bounds, for checking in drawLazily()
    //this.dirty = false;
  }

  updateWidth(childRight){
    this.bounds.right = this.bounds.right + (childRight - this.canvasBounds.right);
    this.canvas.width = this.canvasBounds.width + 10;
  }

  updatePSF(pixelScaleFactor) {
    this.stateStore.setPixelScaleFactor(pixelScaleFactor);
    //this.children.forEach(child=> child.updateView());
  }

  calculateHits(bounds){
    let hits = [];
    this.children.forEach(child => hits = child.calculateHitmap().concat(hits));
    let hm = new RBush();
    hm.load(hits);
    console.log('sgnc-ch',hm.all(), bounds);
    let found = hm.search(bounds);
    console.log('sgnc-ch',found, bounds);
    return found;
  }


}
