/*
 * A slider component to test layouts with varying number of canvases
*/
import m from 'mithril';
import toolState from '../../state/ToolState';
import {devNumberofMaps} from '../../topics';

export class DevMapsSlider  {

  constructor() {
    // make mithril aware the toolState is part of this component's state
    this.toolState = toolState;
  }

  onchange(e) {
    let n = e.target.value;
    this.toolState.devNumberOfMaps = n;
    e.redraw = false;
    PubSub.publish(devNumberofMaps, n);
  }

  view() {
    return m('fieldset', {}, [
      m('label', { for: 'slider'}, [
        `number of maps: ${this.toolState.devNumberOfMaps}`,
        m('input', {
          id: 'slider',
          type: 'range',
          min: 1,
          max: 20,
          value: this.toolState.devNumberOfMaps,
          onchange: (e) => this.onchange(e)
        })
    ])
  ]);
  }
}
