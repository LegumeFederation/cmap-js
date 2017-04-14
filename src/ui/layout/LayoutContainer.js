/**
  * LayoutContainer
  * A mithril component to wrap the current layout component inside of a
  * scrollable div.
  */
import m from 'mithril';
import PubSub from 'pubsub-js';
import Hammer from 'hammerjs';

import {HorizontalLayout} from './HorizontalLayout';
import {CircosLayout} from './CircosLayout';
import {layout as layoutMsg, reset} from '../../topics';
import {Bounds} from '../../util/Bounds';


export class LayoutContainer {

  // constructor() - prefer do not use in mithril components
  constructor() {
    console.log('LayoutContainer()');
  }

  /**
   * mithril lifecycle method
   */
  oninit(vnode) {
    console.log('LayoutContainer.oninit');
    this.appState = vnode.attrs.appState;

    PubSub.subscribe(layoutMsg, (msg, data) => this._onLayoutChange(msg, data));
    PubSub.subscribe(reset, (msg, data) => this._onReset(msg, data));
  }

  /**
   * mithril lifecycle method
   */
  oncreate(vnode) {
    this.el = vnode.dom; // this is the outer m('div') from view()
    this._setupEventHandlers(this.el);
    this.bounds = new Bounds(this.el.getBoundingClientRect());
    console.log('LayoutContainer.oncreate', this.bounds.width, this.bounds.height, this.el);
  }

  /**
   * mithril lifecycle method
   */
  onupdate(vnode) {
    this.bounds = new Bounds(this.el.getBoundingClientRect());
    console.log('LayoutContainer.onupdate', this.bounds.width, this.bounds.height, this.el);
  }

  /**
   * mithril component render method
   */
  view() {
    let b = this.contentPaneBounds || {}; // relative bounds of the layout-content
    let scale = this.appState.tools.zoomFactor;
    return m('div', { class: 'cmap-layout-viewport cmap-hbox'}, [
      m('div', {
        class: 'cmap-layout-container'
      }, [
        this.appState.tools.layout === HorizontalLayout
        ?
        m(HorizontalLayout, {appState: this.appState, layoutBounds: this.bounds })
        :
        m(CircosLayout, {appState: this.appState, layoutBounds: this.bounds})
      ])
    ]);
  }

  /* private functions  */

  _setupEventHandlers(el) {
    // hammers for normalized mouse and touch gestures: zoom, pan, click
    let h = Hammer(el);
    h.get('pan').set({ direction: Hammer.DIRECTION_ALL });
    h.get('pinch').set({ enable: true });
    h.on('panmove panend', (evt) => this._onPan(evt));
    h.on('pinchmove pinchend', (evt) => this._onZoom(evt));
  }

  /* dom event handlers */

  _onZoom(evt) {
    console.log('onZoom', evt);
    // FIXME: get distance of touch event
    let normalized = evt.deltaY / this.bounds.height;
    this.state.tools.zoomFactor += normalized;
    m.redraw();
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
    this.contentPaneBounds.left += delta.x;
    this.contentPaneBounds.top += delta.y;
    m.redraw();
    this.lastPanEvent = evt;
  }

}
