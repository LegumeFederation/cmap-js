/**
 * NewMap
 * A mithril component of a new map button-- probably only useful for development
 * prototyping.
 */
import m from 'mithril';
import toolState from '../../state/ToolState';

//import icon from '../svg-icons/zoom-in.svg';
import {newMap} from '../../topics';

export class NewMap  {

  constructor() {
    // make mithril aware the toolState is part of this component's state
    this.toolState = toolState;
  }

  click(e) {
    e.redraw = false;
    PubSub.publish(newMap, { evt: e });
  }

  view() {
      return m('button', {
          class: 'pure-button',
          onclick: (e) => this.click(e)
        },
        [
          'New Map'
          //,
          //m('span', { class: 'cmap-toolbar-icon'}, m.trust(icon))
        ]
      );
    }
}
