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

import {Bounds} from '../../model/Bounds';
import {SceneGraphNodeBase} from './SceneGraphNodeBase';

export class SceneGraphNodeCanvas extends SceneGraphNodeBase {

  /**
   * constructor
   * @param model - data model for canvas
   * @param appState - app state model
   */

  constructor({model, appState, sub}) {
    super({});
    this.model = model;
    this.appState = appState;
    this.verticalScale = 1;
    this.info = {
      visible: false,
      top: 0,
      left: 0
    };
    this.onChanges = [sub];
  }


  /**
   * Getter if canvas has focus
   * @returns {boolean}
   */
  get selected() {
    return this.appState.selection.bioMaps.indexOf(this) !== -1;
  }

  /**
   *  informs parent context that canvas has updated property
   */
  inform() {
    this.onChanges.forEach(callBack => callBack());
  }

  setCanvas(cvs) {
    this.canvas = cvs;
    this.context2d = cvs.getContext('2d');
    this.dirty = true;
    //this.drawLazily(this.domBounds);
  }

  setDomBounds(bounds) {
    this.domBounds = bounds;
  }

  //view() {
  //  // store these bounds, for checking in drawLazily()
  //  if (this.domBounds && !this.domBounds.isEmptyArea) {
  //    this.lastDrawnMithrilBounds = this.domBounds;
  //  }
  //  let b = this.domBounds || {};
  //  let selectedClass = this.selected ? 'selected' : '';
  //  return m('canvas', {
  //    class: `cmap-canvas cmap-biomap ${selectedClass}`,
  //    style: `left: ${b.left}px; top: ${b.top}px;
  //             width: ${b.width}px; height: ${b.height}px;
  //             transform: rotate(${this.rotation}deg);`,
  //    width: b.width,
  //    height: b.height
  //  });
  //}

  /**
   * draw our scene graph children on canvas element
   */

  draw() {
    let ctx = this.context2d;
    if (!ctx) return;
    if (!this.domBounds) return;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.save();
    //ctx.translate(0.5, 0.5); // prevent subpixel rendering of 1px lines
    this.visible.map(child => {
      child && child.data.draw(ctx);
    });
    ctx.restore();
    // store these bounds, for checking in drawLazily()
    this.lastDrawnCanvasBounds = this.bounds;
    this.inform();
    //this.dirty = false;
  }

  /**
   * lazily draw on the canvas, because (p)react updates the dom asynchronously.
   * The canvas will be cleared when the width and height are changed.
   * So we cannot draw upon the canvas until after that.
   */

  drawLazily(wantedBounds) {
    if (wantedBounds.area === 0) return;
    if (this._drawLazilyTimeoutId) clearTimeout(this._drawLazilyTimeoutId);
    if (!Bounds.areaEquals(this.lastDrawnBounds, wantedBounds)) {
      let tid1 = this._drawLazilyTimeoutId = setTimeout(() => {
        if (tid1 !== this._drawLazilyTimeoutId) return;
        this.drawLazily(wantedBounds);
      });
    }
    else {
      console.log('scheduling lazy draw for: ',
        wantedBounds.width, wantedBounds.height);
      let tid2 = this._drawLazilyTimeoutId = setTimeout(() => {
        if (tid2 !== this._drawLazilyTimeoutId) return;
        if (!Bounds.areaEquals(this.lastDrawnCanvasBounds, wantedBounds)) {
          this.draw();
        }
      });
    }
  }
}
