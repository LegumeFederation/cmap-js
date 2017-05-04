/**
 * A mithril component of Remove Map button
 */
import m from 'mithril';

export class RemoveMapButton  {

 // constructor() - prefer do not use in mithril components

 /**
  * mithril render callback
  */
  view() {
    const attrs = {
      onclick: evt => this._onClick(evt)
    };
    return m('button', attrs, [
      m('i.material-icons', 'remove_circle_outline'),
      'Remove Map'
    ]);
  }

  /**
  * button event handler
  */
  _onClick() {
  }
}
