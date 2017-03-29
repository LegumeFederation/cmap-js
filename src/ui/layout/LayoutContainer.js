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
import {Bounds} from '../../util/Bounds';
import '../../util/wheelListener';
import PubSub from '../../../node_modules/pubsub-js/src/pubsub';

export class LayoutContainer {

  constructor() {
    this.bounds = null; // our dom elements bounds will be captured from mithril
    this.scale = 1;
    this.contentPaneBounds = null; // relative bounds of our movable, scrollabel content pane
    this.horizontalLayout = new HorizontalLayout();
    this.circosLayout = new CircosLayout();
  }

  /* mitrhril component lifecycle functions */

  oninit(vnode) {
    PubSub.subscribe(layoutMsg, (msg, data) => this.onLayoutChange(msg, data)),
    PubSub.subscribe(reset, (msg, data) => this.onReset(msg, data))
  }

  oncreate(vnode) {
    let el = vnode.dom; // this is the outer m('div') from view()

    // zoom layout on wheel events
    addWheelListener(el, evt => this._onZoom(evt));

    // pan the layout on mouse drag gestures.
    // (note: this is different than html5 dragndrop)
    // TODO: add touch event handlers as well ala https://github.com/gajus/pan
    el.addEventListener('mousedown', evt => this._onMouseDown(evt));
    el.addEventListener('mousemove', evt => this._onMouseMove(evt));
    el.addEventListener('mouseup', evt => this._onMouseUp(evt));
    el.addEventListener('mouseenter', evt => this._onMouseEnter(evt));
    el.addEventListener('mouseexit', evt => this._onMouseExit(evt));

    let domRect = vnode.dom.getBoundingClientRect();
    console.assert(domRect.width > 0, 'missing dom element width');
    console.assert(domRect.height > 0, 'missing dom element height');
    this._updateBounds(domRect);
  }

  onupdate(vnode) {
    let domRect = vnode.dom.getBoundingClientRect();
    console.assert(domRect.width > 0, 'missing width');
    console.assert(domRect.height > 0, 'missing height');
    this._updateBounds(domRect);
  }

  /* dom event handlers */
  _onZoom(evt) {
    let pixels = evt.deltaY;
    // convert to a normalized scale factor
    let normalized = pixels / this.bounds.height;
    this.scale += normalized;
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
    this.contentPaneBounds = null;
    if(! data.evt.redraw) m.redraw();
  }

  onLayoutChange(msg, data) {
    if(! data.evt.redraw) m.redraw();
  }

  /* internal functions  */

  // here we capture the bounds of the outer dom element from view().
  // this is leveraging the html/css layouting to fill available space.
  _updateBounds(domRect) {
    this.bounds = new Bounds(domRect);
    // create an initial bounds for the scrollable/zoomable content-pane
    if(! this.contentPaneBounds) {
      this.contentPaneBounds = {
        top: 0,
        left: 0,
        width: this.bounds.width,
        height: this.bounds.height
      };
      // trigger a redraw so the child components see the new bounds of their
      // container in the dom.
      m.redraw();
    }
  }

  _applyPan(deltaX, deltaY) {
    this.contentPaneBounds.left += deltaX;
    this.contentPaneBounds.top += deltaY;
  }

  /* mithril component render callback */
  view() {
    let b = this.contentPaneBounds || {}; // relative bounds of the layout-content
    return m('div', { class: 'cmap-layout-viewport cmap-hbox'}, [
      m('div', {
        class: 'cmap-layout-content',
        style: `top: ${b.top}px;
                left: ${b.left}px;
                width: ${b.width}px;
                height: ${b.height}px;
                transform: scale(${this.scale}, ${this.scale})`
      }, [
        toolState.layout === layouts.horizontalLayout
        ?
        m(this.horizontalLayout)
        :
        m(this.circosLayout)
      ])
    ]);
  }
}
