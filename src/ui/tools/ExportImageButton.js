/**
 * A mithril component of Add Map button
 */
import m from 'mithril';

export class ExportImageButton {

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
      m('i.material-icons', 'get_app'),
      'Export Image'
    ]);
  }
}
