/*
* A component for horizontal layout of Maps
*/
import m from 'mithril';
import {newMap, reset, devNumberofMaps} from '../../topics';
import {Layout} from './layout';
import {BioMap} from '../../canvas/bioMap';
import toolState from '../../state/toolState';

const mapMargin = 20; // px

export class HorizontalLayout extends Layout {

  constructor() {
    super();
    this.children = [];
    this.toolState = toolState;
  }

  oninit(vnode) {
    PubSub.subscribe(newMap, () => this._onNewMap());
    PubSub.subscribe(reset, () => this._onReset());
    PubSub.subscribe(devNumberofMaps, (n) => this._onDevNumberOfMaps());
    this._onDevNumberOfMaps(this.toolState.devNumberOfMaps);
  }

  _onDevNumberOfMaps(n) {
    this.children = [];
    for (var i = 0; i < toolState.devNumberOfMaps; i++) {
      this.children.push(new BioMap());
    }
    m.redraw();
  }

  _onNewMap() {
    let map = new BioMap();
    this.children.push(map);
    m.redraw();
  }

  _onReset() {
    this.children = [];
    for (var i = 0; i < this.toolState.devNumberOfMaps; i++) {
      this.children.push(new BioMap());
    }
    m.redraw();
  }

  view() {
    console.log('render @' + new Date());
    return m('div', { class: 'cmap-layout cmap-vbox' },
      m('div', { class: 'cmap-hbox cmap-stretch' },
        this.children.map(m)
      )
    );
  }
}
