/**
  * DevMapsSlider ===> Just for development/prototyping!
  * A mithril slider component to test layouts with varying number of canvases
  */
import m from 'mithril';
import PubSub from 'pubsub-js';

import {devNumberofMaps} from '../../topics';

export class DevMapsSlider  {

  // constructor() - prefer do not use in mithril components

  onchange(e) {
    let n = e.target.value;
    this.state.tools.devNumberOfMaps = n;
    e.redraw = false;
    PubSub.publish(devNumberofMaps, { evt: e, number: n });
  }

  view(vnode) {
    let numMaps = Object.keys(this.state.bioMaps).length;
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
}
