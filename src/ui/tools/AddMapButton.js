/**
 * A mithril component of Add Map button
 */
import m from 'mithril';

export class AddMapButton {

  // constructor() - prefer do not use in mithril components

  /**
  * mithril render callback
  */
  view() {
    const attrs = {
      onclick: evt => this._onClick(evt)
    };
    return m('button', attrs, [
      m('i.material-icons', 'add_circle_outline'),
      'Add Map'
    ]);
  }

  /**
  * button event handler
  */
  _onClick() {
  }
}
