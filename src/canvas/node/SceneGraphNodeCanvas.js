/**
 * SceneGraphNodeCanvas
 * Mithril component representing a html5 canvas element.
 *
 */

import m from 'mithril';
import PubSub from 'pubsub-js';
import Hammer from 'hammerjs';

import * as mixwith from '../../../mixwith.js/src/mixwith.mjs';
const { mix } = mixwith;

import {DrawLazilyMixin} from '../DrawLazilyMixin.js';
import {RegisterComponentMixin} from '../../ui/RegisterComponentMixin.js';
import {selectedMap} from '../../topics.js';

import {Bounds} from '../../model/Bounds.js';
import {SceneGraphNodeBase} from './SceneGraphNodeBase.js';

export class SceneGraphNodeCanvas
  extends mix(SceneGraphNodeBase)
    .with(DrawLazilyMixin, RegisterComponentMixin) {

  /**
   * constructor
   * @param model - data model for canvas
   * @param appState - app state model
   */

  constructor({model, appState}) {
    super({});
    this.model = model;
    this.appState = appState;
    this.verticalScale = 1;
    this.info = {
      visible: false,
      top: 0,
      left: 0
    };
    this._gestureRegex = {
      pan: new RegExp('^pan'),
      pinch: new RegExp('^pinch'),
      tap: new RegExp('^tap'),
      wheel: new RegExp('^wheel')
    };
  }

  /**
   * Getter if canvas has focus
   * @returns {boolean}
   */

  get selected() {
    return this.appState.selection.bioMaps.indexOf(this) !== -1;
  }

  /**
   * mithril lifecycle method
   * @param vnode
   */

  oncreate(vnode) {
    super.oncreate(vnode);
    this.canvas = this.el = vnode.dom;
    this.context2d = this.canvas.getContext('2d');
    this.drawLazily(this.domBounds);
  }

  /**
   * mithril lifecycle method
   * @param vnode - current virtual dom node
   */

  onupdate(vnode) {
    // TODO: remove this development assistive method
    console.assert(this.el === vnode.dom);
    let b = new Bounds(this.el.getBoundingClientRect());
    console.log('BioMap.onupdate', this.el.mithrilComponent, b);
  }

  /**
   * mithril component render method
   */
  view() {
    // store these bounds, for checking in drawLazily()
    if (this.domBounds && !this.domBounds.isEmptyArea) {
      this.lastDrawnMithrilBounds = this.domBounds;
    }
    let b = this.domBounds || {};
    let selectedClass = this.selected ? 'selected' : '';
    return m('canvas', {
      class: `cmap-canvas cmap-biomap ${selectedClass}`,
      style: `left: ${b.left}px; top: ${b.top}px;
               width: ${b.width}px; height: ${b.height-4}px;
               transform: rotate(${this.rotation}deg);`,
      width: b.width,
      height: b.height-4
    });
  }

  /**
   * draw our scene graph children on canvas element
   */

  draw() {
    let ctx = this.context2d;
    if (!ctx) return;
    if (!this.domBounds) return;
    if(!ctx.canvas) ctx.canvas = this.canvas;
    if(!this.canvas) this.canvas = ctx.canvas;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.save();
    //ctx.translate(0.5, 0.5); // prevent subpixel rendering of 1px lines
    this.visible.map(child => child && child.data.draw(ctx));
    ctx.restore();
    // store these bounds, for checking in drawLazily()
    this.lastDrawnCanvasBounds = this.bounds;
    this.dirty = false;
  }

  /**
   * custom gesture event dispatch listener; see LayoutContainer
   * @param evt
   * @returns {boolean} Don't stop event propagation
   */

  handleGesture(evt) {
    if (evt.type.match(this._gestureRegex.tap)) {
      return this._onTap(evt);
    }
    else if (evt.type.match(this._gestureRegex.pinch)) {
      return this._onZoom(evt);
    }
    else if (evt.type.match(this._gestureRegex.wheel)) {
      return this._onZoom(evt);
    }
    else if (evt.type.match(this._gestureRegex.pan)) {
      if (evt.type === 'panend') {
        return this._onPanEnd(evt);
      } else if (evt.type === 'panstart') {
        return this._onPanStart(evt);
      } else {
        return this._onPan(evt);
      }
    }

    return false; // don't stop evt propagation
  }

  /**
   * Handle zoom event
   * @param evt - zoom event (mousewheel or gesture)
   * @returns {boolean} don't stop event propagation
   * @private
   */

  _onZoom(evt) {
    // TODO: send zoom event to the scenegraph elements which compose the biomap
    // (don't scale the canvas element itself)
    console.warn('BioMap -> onZoom -- implement me', evt);
    return false; // stop event propagation
  }

  /**
   * Tap/Click event
   * @param evt
   * @returns {boolean} Don't stop event propagation by default
   * @private
   */

  _onTap(evt) {
    let sel = this.appState.selection.bioMaps;
    let i = sel.indexOf(this);
    if (i === -1) {
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

  /**
   * Pan event that isn't first or last in sequence
   * @param evt
   * @returns {boolean}
   * @private
   */

  _onPan(evt) {
    // TODO: send pan events to the scenegraph elements which compose the biomap
    // (don't scale the canvas element itself)
    if (evt.direction && Hammer.DIRECTION_VERTICAL) {
      console.warn('BioMap -> onPan -- vertically; implement me', evt);
      return false; // stop event propagation
    }
    return false; // do not stop propagation
  }

  /**
   * First pan event in sequence
   * @param evt
   * @returns {boolean}
   * @private
   */

  _onPanStart(evt) {
    // TODO: send pan events to the scenegraph elements which compose the biomap
    // (don't scale the canvas element itself)
    console.warn('BioMap -> onPanStart -- vertically; implement me', evt);
    return false;
  }

  /**
   * Final pan event in sequence
   * @param evt
   * @returns {boolean}
   * @private
   */

  _onPanEnd(evt) {
    // TODO: send pan events to the scenegraph elements which compose the biomap
    // (don't scale the canvas element itself)
    console.warn('BioMap -> onPanEnd -- vertically; implement me', evt);
    return false; // do not stop propagation
  }
}
