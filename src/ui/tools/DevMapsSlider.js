/**
  * DevMapsSlider ===> Just for development/prototyping!
  * A mithril slider component to test layouts with varying number of canvases
  */
import m from 'mithril';
import PubSub from 'pubsub-js';

import {devNumberofMaps} from '../../topics';

export class DevMapsSlider  {

  // constructor() - prefer do not use in mithril components

  /**
   * mithril lifecycle method
   */
  oninit(vnode) {
    this.appState = vnode.attrs.appState;
  }

  /**
   * mithril component render method
   */
  view(vnode) {
    let numMaps = Object.keys(this.appState.bioMaps).length;
    return m('fieldset',
      vnode.attrs,
      vnode.children && vnode.children.length ?
      vnode.children :
      [
        m('label', { for: 'slider'},
          [
            `number of maps: ${numMaps}`,
            m('input', {
              id: 'slider',
              type: 'range',
              min: 1,
              max: 20,
              value: numMaps,
              onchange: e => this.onchange(e)
            })
          ])
      ]
    );
  }

  /**
   * mithril event handler
   */
  onchange(e) {
    let n = e.target.value;
    this.appState.tools.devNumberOfMaps = n;
    e.redraw = false;
    PubSub.publish(devNumberofMaps, { evt: e, number: n });
  }
}
