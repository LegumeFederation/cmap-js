/**
 * Store a reference to the mithril component on it's corresponding dom
 * element.
 */

export let RegisterComponentMixin = (superclass) => class extends superclass {

  /**
   *
   * @param vnode
   */

  oninit(vnode) {
    if (super.oninit) super.oninit(vnode);
    if (vnode.attrs && vnode.attrs.registerComponentCallback) {
      vnode.attrs.registerComponentCallback(this);
    }
  }

  /**
   *
   * @param vnode
   */

  oncreate(vnode) {
    if (super.oncreate) super.oncreate(vnode);
    vnode.dom.mithrilComponent = this;
  }

  /**
   *
   * @param vnode
   */

  onbeforeremove(vnode) {
    if (super.onbeforeremove) super.onbeforeremove(vnode);
    delete vnode.dom.mithrilComponent;
  }
};
