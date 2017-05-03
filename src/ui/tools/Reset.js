/**
 * Reset
 * A mithril component of a Reset button.
 */
import m from 'mithril';
import PubSub from 'pubsub-js';
import {reset} from '../../topics';

export class Reset  {

  // constructor() - prefer do not use in mithril components

  /**
   * mithril render callback
   */
  view() {
    return m('button', {
      onclick: () => this._onClick()
    }, [
      m('i.material-icons', 'restore_page'),
      'Reset'
    ]);
  }

  /**
   * reset button event handler
   */
  _onClick() {
    PubSub.publish(reset, null);
  }
}
