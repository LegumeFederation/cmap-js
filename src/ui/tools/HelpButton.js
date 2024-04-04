/**
 * A mithril component of a Help button
 */
import m from 'mithril';

export class HelpButton {

  // constructor() - prefer do not use in mithril components

  /**
   * mithril render callback
   * @param vnode
   * @returns {*}
   */
  view(vnode) {
    const attrs = {
      onclick: vnode.attrs.onclick
    };
    return m('button', attrs, [
      m('i.material-icons', 'help'),
      'Help'
    ]);
  }
}
