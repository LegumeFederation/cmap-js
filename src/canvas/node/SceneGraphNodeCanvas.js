/**
  * SceneGraphNodeCanvas
  * Mithril component representing a html5 canvas element.
  *
  */

import m from 'mithril';
import PubSub from 'pubsub-js';
import Hammer from 'hammerjs';

import {mix} from '../../../mixwith.js/src/mixwith';

import {DrawLazilyMixin} from '../DrawLazilyMixin';
import {RegisterComponentMixin} from '../../ui/RegisterComponentMixin';
import {selectedMap} from '../../topics';

import {Bounds} from '../../model/Bounds';
import {SceneGraphNodeBase} from './SceneGraphNodeBase';


export class SceneGraphNodeCanvas 
        extends mix(SceneGraphNodeBase)
        .with(DrawLazilyMixin, RegisterComponentMixin) {

  constructor({model, appState}) {
    super({});
    this.model = model;
    this.appState = appState;
    this.verticalScale = 1;
    this._gestureRegex = {
      pan:   new RegExp('^pan'),
      pinch: new RegExp('^pinch'),
      tap:   new RegExp('^tap'),
      wheel: new RegExp('^wheel')
    };
  }

  get selected() {
    return this.appState.selection.bioMaps.indexOf(this) !== -1;
  }


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
    console.log('BioMap.onupdate', b.width, b.height, this.el);
  }

  /**
   * mithril component render method
   */
  view() {
    // store these bounds, for checking in drawLazily()
    if(this.domBounds && ! this.domBounds.isEmptyArea) {
      this.lastDrawnMithrilBounds = this.domBounds;
    }
    let b = this.domBounds || {};
    let selectedClass = this.selected ? 'selected' : '';
    return m('canvas', {
      class: `cmap-canvas cmap-biomap ${selectedClass}`,
      style: `left: ${b.left}px; top: ${b.top}px;
              width: ${b.width}px; height: ${b.height}px;
              transform: rotate(${this.rotation}deg);`,
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
    console.log('canvas draw', this.domBounds.width, this.domBounds.height);
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.save();
    //ctx.translate(0.5, 0.5); // prevent subpixel rendering of 1px lines
    this.visible.map(child => child && child.data.draw(ctx));
    ctx.restore();
    // store these bounds, for checking in drawLazily()
    this.lastDrawnCanvasBounds = this.bounds;
  }
 /**
   * custom gesture event dispatch listener; see LayoutContainer
   */
  handleGesture(evt) {
    console.log(evt);
    if(evt.type.match(this._gestureRegex.tap)) {
      return this._onTap(evt);
    }
    else if (evt.type.match(this._gestureRegex.pinch)) {
      return this._onZoom(evt);
    }
    else if(evt.type.match(this._gestureRegex.wheel)) {
      return this._onZoom(evt);
    }
    else if(evt.type.match(this._gestureRegex.pan)) {
      return this._onPan(evt);
    }
    return false; // dont stop evt propagation
  }

  _onZoom(evt) {
    // TODO: send zoom event to the scenegraph elements which compose the biomap
    // (dont scale the canvas element itself)
    console.warn('BioMap -> onZoom -- implement me', evt);
    return false; // stop event propagation
  }

  _onTap(evt) {
    console.log('tap');
    console.log(evt);
    let sel = this.appState.selection.bioMaps;
    let i = sel.indexOf(this);
    if(i === -1) {
      sel.push(this);
    }
    else {
      sel.splice(i, 1);
    }
    m.redraw();
    PubSub.publish(selectedMap, {
      evt: evt,
      data: this.appState.selection.bioMaps
    });
    return false;
  }
  _onPan(evt) {
    // TODO: send pan events to the scenegraph elements which compose the biomap
    // (dont scale the canvas element itself)
    if(evt.direction & Hammer.DIRECTION_VERTICAL) {
      console.warn('BioMap -> onPan -- vertically; implement me', evt);
      return true; // stop event propagation
    }
    return false; // do not stop propagation
  }
}
