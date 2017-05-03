/**
  * UI
  * A mithril component presenting all DOM aspects of user-interface.
  */
import m from 'mithril';
import Hammer from 'hammerjs';
import Hamster from 'hamsterjs';
import {mix} from '../../mixwith.js/src/mixwith';

//import {Tools} from './tools/Tools';
import {Header} from './Header';
import {StatusBar} from './StatusBar';
import {LayoutContainer} from './layout/LayoutContainer';
import {RegisterComponentMixin} from './RegisterComponentMixin';

export class UI extends mix().with(RegisterComponentMixin) {

  /**
   * Create a UI instance
   * @param Object - the appState, instance of model/AppModel.
   */
  constructor(appState) {
    super();
    this.appState = appState;
  }

  /**
   * mithril lifecycle method
   */
  oncreate(vnode) {
    super.oncreate(vnode);
    this.el = vnode.dom;
    this._setupEventHandlers(this.el);
  }

  /**
   * mithril component render callback
   */
  view(vnode) {
    let srcAttrs = vnode.attrs || {};
    let attrs = Object.assign({class: 'cmap-layout cmap-vbox'}, srcAttrs);
    let childAttrs = {
      appState: this.appState,
    };
    this._logRenders();
    return m('div',
      attrs,
      vnode.children && vnode.children.length ?
        vnode.children : [
          //m(Tools, childAttrs)
          m(Header, childAttrs),
          m('div', { class: 'cmap-layout-viewport cmap-hbox'},
            m(LayoutContainer, {
              appState: this.appState,
              registerComponentCallback: (comp) => this._layoutContainer = comp
            })
          ),
          m(StatusBar, childAttrs)
        ]
    );
  }

  _logRenders() {
    if(! this.count) this.count = 0;
    this.count += 1;
    console.log(`*** mithril render #${this.count} ***`);
  }

  _setupEventHandlers() {
    this._setupMousewheel();
    this._setupGestures();
  }

  /**
   * setup mouse wheel (hamsterjs) handlers.
   */
  _setupMousewheel() {
    let hamsterHandler = (evt) => {
      // note: the hamster callback has additioanl parameters which are being
      // ignored here (evt, delta, deltaX, deltaY)
      // normalize the event so it is similar to the hammerjs gestures
      evt.center = { x: evt.originalEvent.x, y: evt.originalEvent.y };
      this._dispatchGestureEvt(evt);
    };
    let hamster = Hamster(this.el);
    hamster.wheel(hamsterHandler);
  }

  /**
   * setup gesture (hammerjs) handlers.
   */
  _setupGestures() {
    let hammer = Hammer(this.el);
    hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });
    hammer.get('pinch').set({ enable: true });
    let hammerHandler = (evt) => this._dispatchGestureEvt(evt);
    let hammerEvents = 'panmove panend pinchmove pinchend tap';
    hammer.on(hammerEvents, hammerHandler);
  }

  /**
    * Custom dispatch of ui events. Layout elements like BioMap and
    * CorrespondenceMap are visually overlapping, and so do not fit cleanly into
    * the js event capture or bubbling phases. Query the dom at the events
    * coordinates, and dispatch the event to child who
    * a) intersects with this point
    * b) wants to handle this event (it can decide whether to based on it's
    *    canvas own scenegraph contents, etc.)
    */
  _dispatchGestureEvt(evt) {
    let hitElements = document.elementsFromPoint(evt.center.x, evt.center.y);
    let filtered = hitElements.filter( el => {
      return (el.mithrilComponent && el.mithrilComponent.handleGesture);
    });
    // dispatch event to all the mithril components, until one returns true;
    // effectively the same as 'stopPropagation' on a normal event bubbling.
    filtered.some( el => el.mithrilComponent.handleGesture(evt) );
  }

  /**
   * Gesture event recapture and force upon the LayoutContainer. This is to
   * prevent the the layout container from missing events after it has partially
   * moved out of the viewport.
   */
  handleGesture(evt) {
    this._layoutContainer.handleGesture(evt);
  }

}
