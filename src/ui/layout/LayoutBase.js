/**
  * LayoutBase
  * A Mithril component Base class for Layouts, e.g. HorizontalLayout and
  * CircosLayout.
  */
//import m from 'mithril';
import PubSub from 'pubsub-js';
import Hammer from 'hammerjs';

//import {BioMap} from '../../canvas/BioMap';
//import {CorrespondenceMap} from '../../canvas/CorrespondenceMap';
import {newMap, reset, devNumberofMaps as nmaps} from '../../topics';

export class LayoutBase {

  // constructor() - prefer do not use in mithril components

  /* mithril lifecycle callbacks */

  /**
   * oninit(vnode) - mithril lifecycle callback
   */
  oninit(vnode) {
    super.oninit(vnode);
    this.state = vnode.attrs.state;
    console.log(this.state);
  }

  /**
   * oncreate(vnode) - mithril lifecycle callback
   */
  oncreate(vnode) {
    this._setupEventHandlers(vnode.dom);
    // use our dom element's width and height as basis for our layout
    this._layout();
  }

  /**
   * onupdate(vnode) - mithril lifecycle callback
   */
  onupdate(vnode) {
    // use our dom element's width and height as basis for our layout
    this._layout(vnode.dom);
  }

  /**
   * onbeforeremove(vnode) - mithril lifecycle callback
   */
  onbeforeremove() {
    this._tearDownEventHandlers();
  }

  _setupEventHandlers(el) {
    // pub/sub
    this.subscriptions = [
      PubSub.subscribe(newMap, (msg, data) => this._onNewMap(msg, data)),
      PubSub.subscribe(reset, (msg, data) => this._onReset(msg, data)),
      PubSub.subscribe(nmaps, (msg, data) => this._onDevNumberOfMaps(msg, data))
    ];
    // gestures (hammerjs)
    let h = Hammer(el);
    h.get('pan').set({ direction: Hammer.DIRECTION_ALL });
    h.get('pinch').set({ enable: true });
    let evts = {
      eventIds: 'panmove panend pinchmove pinchend tap',
      handler: (evt) => this._dispatchGestureEvt(evt),
      teardown: () => h.off(evts.eventIds, evts.handler)
    };
    h.on(evts.eventIds, evts.handler); // enable hammerjs for these events
    this._gestureEventDefs = evts; // save for component teardown
  }

  _tearDownEventHandlers() {
    // pub/sub
    this.subscriptions.map(PubSub.unsubscribe);
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
    console.log(evt);
    // FIXME: children must be fetched from vnode.dom
    // this.children.every( (child) => {
    //   console.log(child);
    //   //console.log(child.el.elementsFromPoint(evt.center.x, event.center.y));
    //   return true;
    // });
  }

  _onDevNumberOfMaps() {// msg, data
    // let i, n = data.number;
    // this.bioMaps = [];
    // this.correspondenceMaps = [];
    // for (i = 0; i < n; i++) {
    //   this.bioMaps.push(new BioMap({}));
    // }
    // for (i = 0; i < n -1; i++) {
    //   this.correspondenceMaps.push(new CorrespondenceMap({}));
    // }
    // this._layout();
    // m.redraw();
  }

  _onNewMap() {
    // this.bioMaps.push(new BioMap({}));
    // this.correspondenceMaps.push(new CorrespondenceMap({}));
    // this._layout();
    // m.redraw();
  }

  _onReset() {
    // this.bioMaps = [];
    // for (var i = 0; i < this.state.bioMaps; i++) {
    //   this.bioMaps.push(new BioMap({}));
    // }
    // this._layout();
    // m.redraw();
  }

}
