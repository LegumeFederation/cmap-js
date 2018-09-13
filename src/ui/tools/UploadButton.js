/**
 * A mithril component of Add Map button
 */
import m from 'mithril';

export class UploadButton {

  // constructor() - prefer do not use in mithril dataSourceComponents

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
      m('i.material-icons', 'input'),
      'Add Data'
    ]);
  }
}
