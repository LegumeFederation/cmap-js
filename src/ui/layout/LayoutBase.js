/**
  * LayoutBase
  * A Mithril component Base class for Layouts, e.g. HorizontalLayout and
  * CircosLayout.
  */
import m from 'mithril';
import PubSub from 'pubsub-js';

import toolState from '../../state/ToolState';
import {BioMap} from '../../canvas/BioMap';
import {CorrespondenceMap} from '../../canvas/CorrespondenceMap';
import {newMap, reset, devNumberofMaps as nmaps} from '../../topics';

export class LayoutBase {

  constructor() {
    this.bioMaps = [];
    this.correspondenceMaps = [];
  }

  get children() {
    return [].concat(this.bioMaps, this.correspondenceMaps);
  }

  /* mithril lifecycle callbacks */

  oninit() {
    let i;

    this.subscriptions = [
      PubSub.subscribe(newMap, (msg, data) => this._onNewMap(msg, data)),
      PubSub.subscribe(reset, (msg, data) => this._onReset(msg, data)),
      PubSub.subscribe(nmaps, (msg, data) => this._onDevNumberOfMaps(msg, data))
    ];

    // FIXME: here is a mockup of 3 maps for development
    for (i = 0; i < toolState.devNumberOfMaps; i++) {
      this.bioMaps.push(new BioMap({}));
    }
    // create all our child elements for this layout. Note the bounds
    // of this element is unkown, we will get it from the dom in oncreate and
    // onupdate()
    // FIXME: here is a mockup of 3 maps for development
    for (i = 0; i < toolState.devNumberOfMaps -1; i++) {
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

  onremove() {
    this.subscriptions.map(PubSub.unsubscribe);
  }

  _onDevNumberOfMaps(msg, data) {
    let i, n = data.number;
    this.bioMaps = [];
    this.correspondenceMaps = [];
    for (i = 0; i < n; i++) {
      this.bioMaps.push(new BioMap({}));
    }
    for (i = 0; i < n -1; i++) {
      this.correspondenceMaps.push(new CorrespondenceMap({}));
    }
    this._layout(this._domElement);
    m.redraw();
  }

  _onNewMap() {
    this.bioMaps.push(new BioMap({}));
    this.correspondenceMaps.push(new CorrespondenceMap({}));
    this._layout(this._domElement);
    m.redraw();
  }

  _onReset() {
    this.bioMaps = [];
    for (var i = 0; i < toolState.devNumberOfMaps; i++) {
      this.bioMaps.push(new BioMap({}));
    }
    this._layout(this._domElement);
    m.redraw();
  }

}
