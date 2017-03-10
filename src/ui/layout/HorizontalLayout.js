/*
 * A component for horizontal layout of BioMaps.
*/
import m from 'mithril';
import {LayoutBase} from './LayoutBase';
import {BioMap} from '../../canvas/BioMap';
import toolState from '../../state/ToolState';
import {newMap,
        reset,
        devNumberofMaps as nmaps} from '../../topics';
import {domRectEqual} from '../../util/domRect';

export class HorizontalLayout extends LayoutBase {

  constructor() {
    super();
    this.children = [];
    this.toolState = toolState;
  }

  oninit(vnode) {
    this.subscriptions = [
      PubSub.subscribe(newMap, (msg, data) => this._onNewMap(msg, data)),
      PubSub.subscribe(reset, (msg, data) => this._onReset(msg, data)),
      PubSub.subscribe(nmaps, (msg, data) => this._onDevNumberOfMaps(msg, data)),
    ];
    // FIXME: here is the mockup of 3 maps for development
    this._onDevNumberOfMaps(null, { evt: {}, number: this.toolState.devNumberOfMaps});
  }

  oncreate(vnode) {
    this._updateBounds(vnode);
  }

  onupdate(vnode) {
    console.log('onupdate:');
    console.log(vnode.dom.getBoundingClientRect());
    this._updateBounds(vnode);
  }

  onremove(vnode) {
    this.subscriptions.forEach(token => PubSub.unsubscribe(token));
  }

  /* internal functions  */
  _updateBounds(vnode) {
    let newBounds = vnode.dom.getBoundingClientRect();
    // dont update state and redraw unless the bounding box has changed
    if(domRectEqual(this.bounds, newBounds)) return;
    console.log(this.bounds)
    console.log(this.newBounds);
    this.bounds = newBounds;
    m.redraw();
  }

  _onZoom(msg, data) {
    if(! data.evt.redraw) m.redraw();
  }

  _onDevNumberOfMaps(msg, data) {
    let n = data.number;
    this.children = [];
    for (var i = 0; i < n; i++) {
      this.children.push(new BioMap());
    }
    if(! data.evt.redraw) m.redraw();
  }

  _onNewMap(msg, data) {
    let map = new BioMap();
    this.children.push(map);
    if(! data.evt.redraw) m.redraw();
  }

  _onReset(msg, data) {
    this.children = [];
    for (var i = 0; i < this.toolState.devNumberOfMaps; i++) {
      this.children.push(new BioMap());
    }
    m.redraw();
  }

  view() {
    console.log('render @' + (new Date()).getTime());
    let b = this.bounds || {};
    return m('div', {
        class: 'cmap-horizontal-layout'
      },
      this.children.map(m)
    );
  }
}
