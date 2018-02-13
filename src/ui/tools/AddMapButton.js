/**
 * A mithril component of Add Map button
 */
import m from 'mithril';

export class AddMapButton {

  // constructor() - prefer do not use in mithril components

  /**
   * mithril render callback
   */
  view(vnode) {
    const attrs = {
      onclick: vnode.attrs.onclick
    };
    return m('button', attrs, [
      m('i.material-icons', 'add_circle_outline'),
      'Add Map'
    ]);
  }
}
