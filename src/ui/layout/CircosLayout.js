/*
 * A component for horizontal layout of BioMaps.
*/
import m from 'mithril';
import {LayoutBase} from './LayoutBase';
import {BioMap} from '../../canvas/BioMap';
import {CorrespondenceMap} from '../../canvas/CorrespondenceMap';
import toolState from '../../state/ToolState';
import {domRectEqual} from '../../util/domRect';
import {newMap, reset, devNumberofMaps as nmaps} from '../../topics';


let radians = degrees => degrees * Math.PI / 180;
let degrees = radians => radians * 180 / Math.PI;

export class CircosLayout extends LayoutBase {

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
    // find radius
    let radius = this.bounds.width > this.bounds.height
                ? this.bounds.height * 0.4 : this.bounds.width * 0.4;
    let n = this.children.length;
    let center = {
      x: Math.floor(this.bounds.width * 0.5),
      y: Math.floor(this.bounds.height * 0.5)
    };
    let degreesPerChild = 360 / n;
    let childWidth = Math.floor(1.1 * this.bounds.width / n);
    let childHeight = Math.floor(childWidth * 0.6);
    let degrees = -90;
    for (var i = 0; i < n; i++) {
      let child = this.children[i];
      let rad = radians(degrees);
      let x = center.x - Math.floor(childWidth * 0.5) + Math.floor(radius * Math.cos(rad));
      let y = center.y - Math.floor(childHeight * 0.5) + Math.floor(radius * Math.sin(rad));
      let bounds = {
        left: x,
        top: y,
        width: childWidth,
        height: childHeight
      };
      child.setBounds(bounds);
      child.setRotation(Math.floor(degrees - 90));
      degrees += degreesPerChild;
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
    let children = this.children.map(m);
    children.unshift(m(this.correspondenceMap));
    return m('div', {
        class: 'cmap-layout-horizontal'
      },
      children
    );
  }
}
