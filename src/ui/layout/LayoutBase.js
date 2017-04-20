/**
  * LayoutBase
  * A Mithril component Base class for Layouts, e.g. HorizontalLayout and
  * CircosLayout.
  */
import {Bounds} from '../../model/Bounds';

export class LayoutBase  {

  // constructor() - prefer do not use in mithril components

  /**
   * mithril lifecycle callback
   */
  oninit(vnode) {
    this.appState = vnode.attrs.appState;
  }

  /**
   * mithril lifecycle method
   */
  oncreate(vnode) {
    //if(super.oncreate) super.oncreate(vnode);
    // save a reference to this component's dom element
    this.el = vnode.dom;
    this.bounds = new Bounds(vnode.dom.getBoundingClientRect());
  }

  /**
   * mithril lifecycle method
   */
  onupdate(vnode) {
    this.bounds = new Bounds(vnode.dom.getBoundingClientRect());
  }

}
