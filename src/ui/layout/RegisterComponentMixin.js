/**
  * Store a reference to the mithril component on it's corresponding dom
  * element.
  */

export let RegisterComponentMixin = (superclass) => class extends superclass {

  oncreate(vnode) {
    if(super.oncreate) super.oncreate(vnode);
    vnode.dom.mithrilComponent = this;
  }

  onbeforeremove(vnode) {
    if(super.onbeforeremove) super.onbeforeremove(vnode);
    delete vnode.dom.mithrilComponent;
  }
};
