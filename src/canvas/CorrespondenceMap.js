/**
  * CorrespondenceMap
  * Mithril component for correspondence lines between 2 or more BioMaps with an
  * html5 canvas element.
  */
import m from 'mithril';
import {mix} from '../../mixwith.js/src/mixwith';

import {Bounds} from '../model/Bounds';
import {SceneGraphNodeBase} from './SceneGraphNodeBase';
import {DrawLazilyMixin} from './DrawLazilyMixin';
import {RegisterComponentMixin} from '../ui/RegisterComponentMixin';
import {featuresInCommon} from '../model/Feature';

export class CorrespondenceMap
       extends mix(SceneGraphNodeBase)
       .with(DrawLazilyMixin, RegisterComponentMixin) {

  constructor({bioMapComponents, appState, layoutBounds}) {
    super({});
    this.bioMapComponents = bioMapComponents;
    this.appState = appState;
    this.verticalScale = 1;
    this.correspondenceMarks = [];
    this._layout(layoutBounds);
  }

  // override the children prop. getter
  get children() {
    return this.correspondenceMarks;
  }
  set children(ignore) {}

  /**
   * mithril lifecycle method
   */
  oncreate(vnode) {
    super.oncreate(vnode);
    this.canvas = this.el = vnode.dom;
    this.context2d = this.canvas.getContext('2d');
    this.drawLazily(this.domBounds);
  }

  /**
   * mithril lifecycle method
   */
  onupdate(vnode) {
    // TODO: remove this development assistive method
    console.assert(this.el === vnode.dom);
    let b = new Bounds(this.el.getBoundingClientRect());
    console.log('CorrespondenceMap.onupdate', b.width, b.height, this.el);
  }

  /**
   * mithril component render callback
   */
  view() {
    if(this.domBounds && ! this.domBounds.isEmptyArea) {
      this.lastDrawnMithrilBounds = this.domBounds;
    }
    let b = this.domBounds || {};
    return m('canvas', {
      class: 'cmap-canvas cmap-correspondence-map',
      style: `left: ${b.left}px; top: ${b.top}px;
              width: ${b.width}px; height: ${b.height}px;`,
      width: b.width,
      height: b.height
    });
  }

  /**
   * draw our scenegraph children our canvas element
   */
  draw() {
    let ctx = this.context2d;
    if(! ctx) return;
    if(! this.domBounds) return;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    let gb = this.globalBounds || {};
    ctx.save();
    //this.children.map(child => child.draw(ctx));
    ctx.fillStyle = 'cyan';
    ctx.globalAlpha = 0.2;
    ctx.fillRect(
      Math.floor(gb.left),
      Math.floor(gb.top),
      Math.floor(gb.width),
      Math.floor(gb.height)
    );
    ctx.restore();
    // store these bounds, for checking in drawLazily()
    this.lastDrawnCanvasBounds = this.bounds;
  }

  /**
   * getter for common features between our bioMaps.
   */
  get commonFeatures() {
    // TODO: support more than 2 sets of features (e.g. for circos layout)
    let leftFeatures = this.bioMapComponents[0].model.features;
    let rightFeatures = this.bioMapComponents[1].model.features;
    let common = featuresInCommon(leftFeatures, rightFeatures);
    return common;
  }

  _layout(layoutBounds) {
    this.domBounds = layoutBounds;
    // this.bounds (scenegraph) has the same width and height, but zero the
    // left/top because we are the root node in a canvas sceneGraphNode
    // heirarchy.
    this.bounds = new Bounds({
      left: 0,
      top: 0,
      width: this.domBounds.width,
      height: this.domBounds.height
    });
    console.log(`# of features in common: ${this.commonFeatures.length}`);
  }
}
