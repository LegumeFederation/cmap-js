/*
 * A component for Circos-style layout of BioMaps.
*/
import m from 'mithril';
import {newMap, reset, devNumberofMaps} from '../../topics';
import {LayoutBase} from './LayoutBase';
import {BioMap} from '../../canvas/BioMap';
import toolState from '../../state/ToolState';


export class CircosLayout extends LayoutBase {

  constructor() {
    super();
    this.children = [];
    this.toolState = toolState;
  }

  oninit(vnode) {
    this.subscriptions = [
      PubSub.subscribe(newMap, (msg, data) => this._onNewMap(msg, data)),
      PubSub.subscribe(reset, (msg, data) => this._onReset(msg, data)),
      PubSub.subscribe(devNumberofMaps, (msg, data) => this._onDevNumberOfMaps(msg, data))
    ];
    this._onDevNumberOfMaps(null, { evt: {}, number: this.toolState.devNumberOfMaps});
  }

  onremove(vnode) {
    this.subscriptions.forEach(token => PubSub.unsubscribe(token));
  }

  _onDevNumberOfMaps(msg, data) {
    this.children = [];
    let n = data.number;
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
    return m('div', { class: 'cmap-circos-layout'});
  }
}
