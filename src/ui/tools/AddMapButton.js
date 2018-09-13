/**
 * A mithril component of Add Map button
 */
import m from 'mithril';

export class AddMapButton {

  // constructor() - prefer do not use in mithril dataSourceComponents

  /**
   * mithril render callback
   * @param vnode
   * @return {*}
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
