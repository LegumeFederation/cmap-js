/**
 * Reset
 * A mithril component of a Reset button.
 */
import m from 'mithril';
import PubSub from 'pubsub-js';
import {reset} from '../../topics';

export class ResetButton {

  // constructor() - prefer do not use in mithril components

  /**
   * mithril render callback
   */
  view() {
    return m('button', {
      onclick: evt => this._onClick(evt)
    }, [
      m('i.material-icons', 'restore'),
      'Reset View'
    ]);
  }

  /**
   * reset button event handler
   */
  _onClick(evt) {
    PubSub.publish(reset, null);
    // subscribers to the reset topic may m.redraw if they need to; suppress
    // redraw for the current event.
    evt.redraw = false;
  }
}
