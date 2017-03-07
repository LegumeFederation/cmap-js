/*
* A component for horizontal layout of Maps
*/
import m from 'mithril';
import {newMap} from '../../topics';
import toolState from '../../state/toolState';
import {Layout} from './layout';
import {domRectEqual} from '../../util/domRect';
import {BioMap} from '../../canvas/bioMap';

export class HorizontalLayout extends Layout {

  constructor() {
    super();
    // make mithril aware we are interested in this state
    this.toolState = toolState;
    this.children = [];
  }

  oncreate(vnode) {
    this._updateBounds(vnode);
    PubSub.subscribe(newMap, () => this._onNewMap());
  }

  _onNewMap() {
    let map = new BioMap();
    this.children.push(map);
    console.log(this.children);
//    m.redraw();
  }

  onupdate(vnode) {
    this._updateBounds(vnode);
  }

  _updateBounds(vnode) {
    let newBounds = vnode.dom.getBoundingClientRect();
    // dont update state and redraw unless the bounding has changed
    if(domRectEqual(this.bounds, newBounds)) return;
    this.bounds = newBounds;
    m.redraw();
  }

  view() {
    // wrap the canvas in a css grid row, to establish the boundingBox width
    // of this component
    console.log('render @' + new Date());
    return m('div', { class: 'pure-u-1 cmap-layout' }, [
      m('div', {
        class: 'cmap-layout-horizontal',
        style: this.bounds ?
               `height: ${this.bounds.height - this.bounds.top - 10}px`
               :
               ''
      },
      this.children.map(m)
    )]);
  }
}
