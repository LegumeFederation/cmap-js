/**
  * CorrespondenceMap
  * Mithril component representing correspondence lines between 2 or more
  * BioMaps with an html5 canvas element.
  */
import m from 'mithril';
import {mix} from '../../mixwith.js/src/mixwith';

import {Bounds} from '../model/Bounds';
import {SceneGraphNodeBase} from './SceneGraphNodeBase';
import {DrawLazilyMixin} from './DrawLazilyMixin';
import {RegisterComponentMixin} from '../ui/layout/RegisterComponentMixin';

export class CorrespondenceMap
       extends mix(SceneGraphNodeBase)
       .with(DrawLazilyMixin, RegisterComponentMixin) {

  constructor({bioMapComponents, layoutBounds}) {
    super({});

    this.bioMapComponents = bioMapComponents;

    // note: this.domBounds is where the canvas element is absolutely positioned
    // by mithril view()
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
  }

  /**
   * mithril lifecycle method
   */
  oncreate(vnode) {
    super.oncreate(vnode);
    this.el = vnode.dom;
    this.canvas = this.el = vnode.dom;
    this.context2d = this.canvas.getContext('2d');
    this.drawLazily(this.domBounds);
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
    ctx.translate(0.5, 0.5); // prevent subpixel rendering of 1px lines
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
}
