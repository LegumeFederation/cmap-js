/*
 * A component for horizontal layout of BioMaps.
*/
import m from 'mithril';
import {newMap, reset, devNumberofMaps} from '../../topics';
import {LayoutBase} from './LayoutBase';
import {BioMap} from '../../canvas/BioMap';
import toolState from '../../state/ToolState';


export class HorizontalLayout extends LayoutBase {

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

  _onDevNumberOfMaps(msg) {
    let n = msg.number;
    this.children = [];
    for (var i = 0; i < n; i++) {
      this.children.push(new BioMap());
    }
    if(! msg.evt.redraw) m.redraw();
  }

  _onNewMap(msg) {
    let map = new BioMap();
    this.children.push(map);
    if(! msg.evt.redraw) m.redraw();
  }

  _onReset() {
    this.children = [];
    for (var i = 0; i < this.toolState.devNumberOfMaps; i++) {
      this.children.push(new BioMap());
    }
    m.redraw();
  }

  view() {
    console.log('render @' + (new Date()).getTime());
    return m('div', { class: 'cmap-layout cmap-vbox' },
      m('div', { class: 'cmap-hbox cmap-stretch' },
        this.children.map(m)
      )
    );
  }
}
