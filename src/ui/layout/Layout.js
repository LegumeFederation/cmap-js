/*
* A component to wrap the selected layout component inside of a clipping region
* overflow: hidden in css.
*/
import m from 'mithril';
import {HorizontalLayout} from './HorizontalLayout';
import {CircosLayout} from './CircosLayout';
import * as layouts from '../../layouts';
import {layout as layoutMsg, reset} from '../../topics';
import toolState from '../../state/ToolState';
import {domRectEqual} from '../../util/domRect';
import '../../util/wheelListener';
import PubSub from '../../../node_modules/pubsub-js/src/pubsub';

export class Layout {

  constructor() {
    this.toolState = toolState;
    this.horizontalLayout = new HorizontalLayout();
    this.circosLayout = new CircosLayout();
  }

  /* mitrhril component lifecycle functions */
  oninit(vnode) {
    this.subscriptions = [
      // layout change message
      PubSub.subscribe(layoutMsg, (msg, data) => this.onLayoutChange(msg, data)),
      PubSub.subscribe(reset, (msg, data) => this.onReset(msg, data))
    ];
  }

  // the dom element is accessible in oncreate and after
  oncreate(vnode) {
    this._updateBounds(vnode);

    // zoom layout on wheel events
    addWheelListener(vnode.dom, evt => this._onZoom(evt));

    // pan the layout on mouse drag gestures.
    // (note: this is different than html5 dragndrop)
    // TODO: add touch event handlers as well ala https://github.com/gajus/pan
    vnode.dom.addEventListener('mousedown', evt => this._onMouseDown(evt));
    vnode.dom.addEventListener('mousemove', evt => this._onMouseMove(evt));
    vnode.dom.addEventListener('mouseup', evt => this._onMouseUp(evt));
    vnode.dom.addEventListener('mouseenter', evt => this._onMouseEnter(evt));
    vnode.dom.addEventListener('mouseexit', evt => this._onMouseExit(evt));
  }

  onupdate(vnode) {
    this._updateBounds(vnode);
  }

  /* dom event handlers */
  _onZoom(evt) {
    this._applyZoomFactor(evt.deltaY);
    m.redraw();
  }

  _onMouseDown(evt) {
    this.dragging = true;
  }

  _onMouseUp(evt) {
    this.dragging = false;
  }

  _onMouseMove(evt) {
    if(this.dragging) {
      this._applyPan(evt.movementX, evt.movementY);
      m.redraw();
    }
  }

  _onMouseEnter(evt) {
    this.dragging = false;
  }

  _onMouseExit(evt) {
    this.dragging = false;
  }

  /* pub/sub callback functions */
  onReset(msg, data) {
    this.relativeBounds = null;
    this._applyZoomFactor(this.toolState.zoomFactor);
    if(! data.evt.redraw) m.redraw();
  }

  onLayoutChange(msg, data) {
    if(! data.evt.redraw) m.redraw();
  }

  /* internal functions  */
  _updateBounds(vnode) {
    let newBounds = vnode.dom.getBoundingClientRect();
    // dont update state and redraw unless the bounding box has changed
    if(domRectEqual(this.bounds, newBounds)) return;
    this.bounds = newBounds;
    this._applyZoomFactor(this.toolState.zoomFactor);
    m.redraw();
  }

  _applyPan(deltaX, deltaY) {
    if( ! this.relativeBounds) {
      this.relativeBounds = {
        top: 0,
        left: 0,
        width: this.bounds.width,
        height: this.bounds.height
      };
    }
    else {
      this.relativeBounds.left += deltaX;
      this.relativeBounds.top += deltaY;
    }
  }
  /*
   * deltaY is in vertical pixels of scroll
   * convert this to a factor by dividing into window.innerHeight
   * apply to the relativeBounds width and height, mainaining aspect ratio.
   */
  _applyZoomFactor(deltaY) {
    let minWidth = this.bounds.width * 0.5;
    if( ! this.relativeBounds || deltaY === 0) {
      this.relativeBounds = {
        top: 0,
        left: 0,
        width: this.bounds.width,
        height: this.bounds.height
      };
    }
    else {
      let factor = deltaY / window.innerHeight;
      let adjustWidth = this.relativeBounds.width * factor;
      let adjustHeight = this.relativeBounds.height * factor;
      let w = this.relativeBounds.width + adjustWidth;
      let h = this.relativeBounds.height + adjustHeight;
      this.relativeBounds = { top: 0, left: 0, width: w, height: h };
    }
  }

  /* mithril component render */
  view() {
    let b = this.relativeBounds || {};
    return m('div', { class: 'cmap-layout-viewport cmap-hbox'}, [
      m('div', {
        class: 'cmap-layout-content',
        style: `top: ${b.top}px; left: ${b.left}px; width: ${b.width}px; height: ${b.height}px`
      }, [
        this.toolState.layout === layouts.horizontalLayout
        ?
        m(this.horizontalLayout)
        :
        m(this.circosLayout)
      ])
    ]);
  }
}
