/**
 * Store a reference to the mithril component on it's corresponding dom
 * element.
 */

export let RegisterComponentMixin = (superclass) => class extends superclass {

  oninit(vnode) {
    if (super.oninit) super.oninit(vnode);
    if (vnode.attrs && vnode.attrs.registerComponentCallback) {
      vnode.attrs.registerComponentCallback(this);
    }
  }

  oncreate(vnode) {
    if (super.oncreate) super.oncreate(vnode);
    vnode.dom.mithrilComponent = this;
  }

  onbeforeremove(vnode) {
    if (super.onbeforeremove) super.onbeforeremove(vnode);
    delete vnode.dom.mithrilComponent;
  }
};
