/**
  * LayoutContainer
  * A mithril component to wrap the current layout component inside of a
  * scrollable div.
  */
import m from 'mithril';
import PubSub from 'pubsub-js';
import {mix} from '../../../mixwith.js/src/mixwith';

import {HorizontalLayout} from './HorizontalLayout';
import {CircosLayout} from './CircosLayout';
import {layout as layoutMsg, reset} from '../../topics';
import {Bounds} from '../../model/Bounds';
import {RegisterComponentMixin} from '../RegisterComponentMixin';


export class LayoutContainer extends mix().with(RegisterComponentMixin) {

  // constructor() - prefer do not use in mithril components

  /**
   * mithril lifecycle method
   */
  oninit(vnode) {
    super.oninit(vnode);
    this.appState = vnode.attrs.appState;

    PubSub.subscribe(layoutMsg, (msg, data) => this._onLayoutChange(msg, data));
    PubSub.subscribe(reset, (msg, data) => this._onReset(msg, data));

    // create some regular expressions for faster dispatching of events
    this._gestureRegex = {
      pan:   new RegExp('^pan'),
      pinch: new RegExp('^pinch'),
      tap:   new RegExp('^tap'),
      wheel: new RegExp('^wheel')
    };
  }

  /**
   * mithril lifecycle method
   */
  oncreate(vnode) {
    super.oncreate(vnode);
    this.el = vnode.dom; // this is the outer m('div') from view()
    //this._setupEventHandlers(this.el);
    this.bounds = new Bounds(this.el.getBoundingClientRect());
    this.contentBounds = new Bounds({
      left: 0,
      top: 0,
      width: this.bounds.width,
      height: this.bounds.height
    });
  }

  /**
   * mithril lifecycle method
   */
  onupdate(vnode) {
    this.bounds = new Bounds(vnode.dom.getBoundingClientRect());
  }

  /**
   * mithril component render method
   */
  view() {
    let b = this.contentBounds || {}; // relative bounds of the layout-container
    let scale = this.appState.tools.zoomFactor;
    return m('div.cmap-layout-container', {
      style: `left: ${b.left}px; top: ${b.top}px;
              width: ${b.width}px; height: ${b.height}px;
              transform: scale(${scale})`
    }, [
      this.appState.tools.layout === HorizontalLayout
      ?
      m(HorizontalLayout, {appState: this.appState, layoutBounds: this.bounds })
      :
      m(CircosLayout, {appState: this.appState, layoutBounds: this.bounds})
    ]);
  }

  /**
   * handle the event from _dispatchGestureEvt. Returns true or false
   * to stop or continue event propagation.
   */
  handleGesture(evt) {
    if(evt.type.match(this._gestureRegex.pan)) {
      return this._onPan(evt);
    }
    else if (evt.type.match(this._gestureRegex.pinch)) {
      return this._onZoom(evt);
    }
    else if (evt.type.match(this._gestureRegex.wheel)) {
      return this._onZoom(evt);
    }
    return false; // do not stop event propagation
  }

  _onZoom(evt) {
    console.log('LayoutContainer -> onZoom', evt);
    // FIXME: utilize the distance of touch event
    let normalized = evt.deltaY / this.bounds.height;
    this.appState.tools.zoomFactor += normalized;
    m.redraw();
    return true; // stop evt propagation
  }

  _onPan(evt) {
    console.log('LayoutContainer -> onPan', evt);
    // hammer provides the delta x,y in a distance since the start of the
    // gesture so need to convert it to delta x,y for this event.
    if(evt.type === 'panend') {
      this.lastPanEvent = null;
      return;
    }
    let delta = {};
    if(this.lastPanEvent) {
      delta.x = -1 * (this.lastPanEvent.deltaX - evt.deltaX);
      delta.y = -1 * (this.lastPanEvent.deltaY - evt.deltaY);
    }
    else {
      delta.x = evt.deltaX;
      delta.y = evt.deltaY;
    }
    this.contentBounds.left += delta.x;
    this.contentBounds.top += delta.y;
    m.redraw();
    this.lastPanEvent = evt;
    return true; // stop event propagation
  }

  /**
   * PubSub event handler
   */
  _onReset() {
    this.contentBounds = new Bounds({
      left: 0,
      top: 0,
      width: this.bounds.width,
      height: this.bounds.height
    });
    m.redraw();
  }

}
