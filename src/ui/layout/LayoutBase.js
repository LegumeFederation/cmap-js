/**
 *  Base class for Layouts
 */
import m from 'mithril';
import {BioMap} from '../../canvas/BioMap';
import {CorrespondenceMap} from '../../canvas/CorrespondenceMap';
import {newMap, reset, devNumberofMaps as nmaps} from '../../topics';
import PubSub from '../../../node_modules/pubsub-js/src/pubsub';
import toolState from '../../state/ToolState';

export class LayoutBase {

  constructor() {
    this.bioMaps = [];
    this.correspondenceMaps = [];
  }

  get children() {
    return [].concat(this.bioMaps, this.correspondenceMaps);
  }

  /* mithril lifecycle callbacks */

  oninit(vnode) {
    this.subscriptions = [
      PubSub.subscribe(newMap, (msg, data) => this._onNewMap(msg, data)),
      PubSub.subscribe(reset, (msg, data) => this._onReset(msg, data)),
      PubSub.subscribe(nmaps, (msg, data) => this._onDevNumberOfMaps(msg, data))
    ];
    this.bioMaps = [];
    this.correspondenceMaps = [];

    // FIXME: here is a mockup of 3 maps for development
    for (var i = 0; i < toolState.devNumberOfMaps; i++) {
      this.bioMaps.push(new BioMap({}));
    }
    // create all our child elements for this layout. Note the bounds
    // of this element is unkown, we will get it from the dom in oncreate and
    // onupdate()
    // FIXME: here is a mockup of 3 maps for development
    for (var i = 0; i < toolState.devNumberOfMaps; i++) {
      this.correspondenceMaps.push(new CorrespondenceMap({}));
    }
  }

  oncreate(vnode) {
    // use our dom element's width and height as basis for our layout
    this._layout(vnode.dom);
  }

  onupdate(vnode) {
    // use our dom element's width and height as basis for our layout
    this._layout(vnode.dom);
  }

  onremove(vnode) {
    this.subscriptions.map(PubSub.unsubscribe);
  }

  _onZoom(msg, data) {
    if(! data.evt.redraw) m.redraw();
  }

  _onDevNumberOfMaps(msg, data) {
    let n = data.number;
    this.bioMaps = [];
    for (var i = 0; i < n; i++) {
      this.bioMaps.push(new BioMap({}));
    }
    this._layout(this._domElement);
    m.redraw();
  }

  _onNewMap(msg, data) {
    let map = new BioMap({});
    this.bioMaps.push(map);
    this._layout(this._domElement);
    m.redraw();
  }

  _onReset(msg, data) {
    this.bioMaps = [];
    for (var i = 0; i < toolState.devNumberOfMaps; i++) {
      this.bioMaps.push(new BioMap({}));
    }
    this._layout(this._domElement);
    m.redraw();
  }

}
