/**
  * DevMapsSlider ===> Just for development/prototyping!
  * A mithril slider component to test layouts with varying number of canvases
  */
import m from 'mithril';
import PubSub from 'pubsub-js';

import toolState from '../../state/ToolState';
import {devNumberofMaps} from '../../topics';

export class DevMapsSlider  {

  onchange(e) {
    let n = e.target.value;
    toolState.devNumberOfMaps = n;
    e.redraw = false;
    PubSub.publish(devNumberofMaps, { evt: e, number: n });
  }

  view(vnode) {
    return m('fieldset',
      vnode.attrs,
      vnode.children && vnode.children.length ?
        vnode.children :
        [
          m('label', { for: 'slider'},
             [
              `number of maps: ${toolState.devNumberOfMaps}`,
              m('input', {
                id: 'slider',
                type: 'range',
                min: 1,
                max: 20,
                value: toolState.devNumberOfMaps,
                onchange: e => this.onchange(e)
              })
            ])
      ]
    );
  }
}
