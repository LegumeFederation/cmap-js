/**
 * A mithril component of Remove Map button
 */
import m from 'mithril';

export class RemoveMapButton {

  // constructor() - prefer do not use in mithril components

  /**
   * mithril render callback
   */
  view(vnode) {
    const attrs = {
      onclick: vnode.attrs.onclick
    };
    return m('button', attrs, [
      m('i.material-icons', 'remove_circle_outline'),
      'Remove Map'
    ]);
  }
}
