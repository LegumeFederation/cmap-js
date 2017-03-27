/*
 * A component for horizontal layout of BioMaps.
*/
import m from 'mithril';
import {LayoutBase} from './LayoutBase';
import {BioMap} from '../../canvas/BioMap';
import {CorrespondenceMap} from '../../canvas/CorrespondenceMap';
import toolState from '../../state/ToolState';
import {domRectEqual} from '../../util/domRectEqual';
import {newMap, reset, devNumberofMaps as nmaps} from '../../topics';
import PubSub from '../../../node_modules/pubsub-js/src/pubsub';

export class HorizontalLayout extends LayoutBase {

  constructor() {
    super();
    this.children = [];
    this.correspondenceMap = new CorrespondenceMap();
    this.toolState = toolState;
  }

  oninit(vnode) {
    this.subscriptions = [
      PubSub.subscribe(newMap, (msg, data) => this._onNewMap(msg, data)),
      PubSub.subscribe(reset, (msg, data) => this._onReset(msg, data)),
      PubSub.subscribe(nmaps, (msg, data) => this._onDevNumberOfMaps(msg, data)),
    ];
    this.children = []; // FIXME: here is the mockup of 3 maps for development
    for (var i = 0; i < this.toolState.devNumberOfMaps; i++) {
      this.children.push( new BioMap() );
    }
  }

  oncreate(vnode) {
    this._updateBounds(vnode);
  }

  onupdate(vnode) {
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
    this.bounds = newBounds;
    this._layoutChildren();
    this.correspondenceMap.setBounds({
      top: 0, left: 0,
      width: Math.floor(this.bounds.width),
      height: Math.floor(this.bounds.height)
    });
    m.redraw();
  }

  _layoutChildren() {
    let n = this.children.length;
    let padding = Math.floor(this.bounds.width * 0.1 / n);
    let childWidth = Math.floor((this.bounds.width - (n * padding)) / n);
    let childHeight = Math.floor(this.bounds.height);
    let cursor = Math.floor(padding * 0.5);
    for (var i = 0; i < n; i++) {
      let child = this.children[i];
      let bounds = {
        left: cursor,
        top: 0,
        width: childWidth,
        height: childHeight
      };
      child.setBounds(bounds);
      cursor += childWidth + padding;
    }
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
    this._layoutChildren();
    if(! data.evt.redraw) m.redraw();
  }

  _onNewMap(msg, data) {
    let map = new BioMap();
    this.children.push(map);
    this._layoutChildren();
    if(! data.evt.redraw) m.redraw();
  }

  _onReset(msg, data) {
    this.children = [];
    for (var i = 0; i < this.toolState.devNumberOfMaps; i++) {
      this.children.push(new BioMap());
    }
    this._layoutChildren();
    m.redraw();
  }

  view() {
    console.log('render @' + (new Date()).getTime());
    let b = this.bounds || {};
    return m('div', {
        class: 'cmap-layout-horizontal'
      },
     this.children.concat(this.correspondenceMap).map(m)
    );
  }
}
