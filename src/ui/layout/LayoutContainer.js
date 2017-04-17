/**
  * LayoutContainer
  * A mithril component to wrap the current layout component inside of a
  * scrollable div.
  */
import m from 'mithril';
import PubSub from 'pubsub-js';
import Hammer from 'hammerjs';
import Hamster from 'hamsterjs';

import {mix} from '../../../mixwith.js/src/mixwith';

import {HorizontalLayout} from './HorizontalLayout';
import {CircosLayout} from './CircosLayout';
import {layout as layoutMsg, reset} from '../../topics';
import {Bounds} from '../../util/Bounds';
import {RegisterComponentMixin} from './RegisterComponentMixin';


export class LayoutContainer extends mix().with(RegisterComponentMixin) {

  // constructor() - prefer do not use in mithril components

  /**
   * mithril lifecycle method
   */
  oninit(vnode) {
    this.appState = vnode.attrs.appState;

    PubSub.subscribe(layoutMsg, (msg, data) => this._onLayoutChange(msg, data));
    PubSub.subscribe(reset, (msg, data) => this._onReset(msg, data));
  }

  /**
   * mithril lifecycle method
   */
  oncreate(vnode) {
    super.oncreate(vnode);
    this.el = vnode.dom; // this is the outer m('div') from view()
    this._setupEventHandlers(this.el);
    this.bounds = new Bounds(this.el.getBoundingClientRect());
    this.contentBounds = new Bounds(this.bounds);
  }

  /**
   * mithril lifecycle method
   */
  onupdate(vnode) {
    console.assert(this.el === vnode.dom);
    this.bounds = new Bounds(vnode.dom.getBoundingClientRect());
  }

  /**
   * mithril lifecycle method
   */
  onbeforeremove(vnode) {
    super.onbeforeremove(vnode);
    this._tearDownEventHandlers();
  }

  /**
   * mithril component render method
   */
  view() {
    let b = this.contentBounds || {}; // relative bounds of the layout-container
    let scale = this.appState.tools.zoomFactor;
    return m('div', {
      class: 'cmap-layout-container',
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

  /* private functions  */

  _setupEventHandlers() {
    // gestures (hammerjs)
    let h = Hammer(this.el);
    h.get('pan').set({ direction: Hammer.DIRECTION_ALL });
    h.get('pinch').set({ enable: true });
    let evts = {
      eventIds: 'panmove panend pinchmove pinchend tap',
      handler: (evt) => this._dispatchGestureEvt(evt),
      teardown: () => h.off(evts.eventIds, evts.handler)
    };
    h.on(evts.eventIds, evts.handler); // enable hammerjs for these events
    this._gestureEventDefs = evts; // save for component teardown
    // create some regular expressions for faster dispatching of events
    this._gestureRegex = {
      pan:   new RegExp('^pan'),
      pinch: new RegExp('^pinch'),
      tap:   new RegExp('^tap')
    };
  }

  _tearDownEventHandlers() {
    // gestures (hammerjs)
    this._gestureEventDefs.teardown();
  }

  /**
   * Custom dispatch of ui events. Layout elements like BioMap and
   * CorrespondenceMap are visually overlapping, and so do not fit cleanly into
   * the js event capture or bubbling phases. Query the dom at the events
   * coordinates, and dispatch the event to child who
   * a) intersects with this point
   * b) wants to handle this event (it can decide whether to based on it's
   * canvas scenegraph contents)
   */
  _dispatchGestureEvt(evt) {
    let hitElements = document.elementsFromPoint(evt.center.x, evt.center.y);
    let filtered = hitElements.filter( el => {
      return el.mithrilComponent && el.mithrilComponent.handleGesture;
    });
    // dispatch event to all the mithril components, until one returns true;
    // effectively the same as 'stopPropagation' on a normal event bubbling.
    filtered.some( el => el.mithrilComponent.handleGesture(evt) );
  }

  /**
   * handle the event from _dispatchGestureEvt. Returns true or false
   * to stop or continue event propagation.
   */
  handleGesture(evt) {
    if(evt.type.match(this._gestureRegex.pan)) {
      this._onPan(evt);
      return true;
    }
    else if (evt.type.match(this._gestureRegex.pinch)) {
      this._onZoom(evt);
      return true;
    }
    return false; // do not stop event propagation
  }

  _onZoom(evt) {
    console.log('onZoom', evt);
    // FIXME: get distance of touch event
    let normalized = evt.deltaY / this.bounds.height;
    this.appState.tools.zoomFactor += normalized;
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
    this.contentBounds.left += delta.x;
    this.contentBounds.top += delta.y;
    m.redraw();
    this.lastPanEvent = evt;
  }

}
