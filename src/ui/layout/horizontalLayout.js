/*
* A component for horizontal layout of Maps
*/
import m from 'mithril';
import {newMap} from '../../topics';
import toolState from '../../state/toolState';
import {Layout} from './layout';
import {domRectEqual} from '../../util/domRect';
import {BioMap} from '../../canvas/bioMap';

const mapMargin = 20; // px

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
    this._updateLayout();
    m.redraw();
  }

  onupdate(vnode) {
    this._updateBounds(vnode);
    this._updateLayout();
  }

  // let each child know new bounds
  _updateLayout() {
    if(! this.children.length) return;
    let childWidth = Math.floor(this._bounds.width / this.children.length)
                     - mapMargin;
    this.children.forEach( (child, i) => {
        child.setBounds({
        width: childWidth,
        height: this.layoutHeight,
        left: i * (childWidth + mapMargin),
        top: 0
      });
    });
  }

  _updateBounds(vnode) {
    let newBounds = vnode.dom.getBoundingClientRect();
    // dont update state and redraw unless the bounding box has changed
    if(domRectEqual(this._bounds, newBounds)) return;
    this._bounds = newBounds;
    // calculate a new height for the children component (biomap canvases)
    this.layoutHeight = newBounds.height - newBounds.top - 10;
    m.redraw();
  }

  view() {
    // wrap the canvas in a css grid row, to establish the boundingBox width
    // of this component
    console.log('render @' + new Date());
    return m('div', { class: 'pure-u-1 cmap-layout' }, [
      m('div', {
        class: 'cmap-layout-horizontal',
        style: `height: ${this.layoutHeight} px`
      },
      this.children.map(m)
    )]);
  }
}
