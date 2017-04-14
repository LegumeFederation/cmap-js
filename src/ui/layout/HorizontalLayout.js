/**
  * HorizontalLayout
  * A mithril component for horizontal layout of BioMaps.
  */
import m from 'mithril';

import {LayoutBase} from './LayoutBase';
import {Bounds} from '../../util/Bounds';
import {BioMap
        as BioMapComponent} from '../../canvas/BioMap';
import {CorrespondenceMap
        as CorrespondenceMapComponent} from '../../canvas/CorrespondenceMap';

export class HorizontalLayout extends LayoutBase {

  // constructor() - prefer do not use in mithril components
  constructor() {
    super();
    console.log('HorizontalLayout()');
  }

  oninit(vnode) {
    super.oninit(vnode);
    console.log('HorizontalLayout.oninit');
    this.bioMapComponents = [];
  }

  oncreate(vnode) {
    super.oncreate(vnode);
    console.log('HorizontalLayout.oncreate', this.bounds.width, this.bounds.height, this.el);
    // redraw now our bounds are known, so the child maps can be layouted
    this._layoutBioMaps();
    m.redraw();
  }

  onupdate(vnode) {
    super.onupdate(vnode);
    console.log('HorizontalLayout.onupdate', this.bounds.width, this.bounds.height, this.el);
  }

  /**
   * mithril component render method
   */
  view(vnode) {
    console.log('HorizontalLayout.view', this.bounds, this.bounds);
    return m('div', {
        class: 'cmap-layout-horizontal'
      },
      this.bioMapComponents.map(m)
      // TODO: correspondenceMaps
    );
  }

  /**
   * Make horizonal (left to right) layout of BioMaps
   */
  _layoutBioMaps() {
    if(! this.bounds) return []; // early out if the layout bounds is not yet known
    let n = this.appState.bioMaps.length;
    let padding = Math.floor(this.bounds.width * 0.1 / n);
    let childHeight = Math.floor(this.bounds.height * 0.975);
    let cursor = Math.floor(padding * 0.5);
    this.bioMapComponents = this.appState.bioMaps.map( bioMapModel => {
        let layoutBounds = new Bounds({
          left: cursor,
          top: 10,
          width: 0, // will be calculated by bioMap
          height: childHeight
      });
      let bioMap = new BioMapComponent({bioMapModel, layoutBounds});
      cursor += bioMap.domBounds.width + padding;
      return bioMap
    });
  }

  _layoutCorrespondenceMaps() {
    let childWidth = Math.floor(this.domBounds.width / this.state.bioMaps.length);
    let childHeight = Math.floor(this.domBounds.height);
    let cursor = childWidth * 0.5;
    this.state.correspondenceMaps.forEach( (child, i) => {
      child.domBounds = new Bounds({
        left: cursor,
        top: 0,
        width: childWidth,
        height: childHeight
      });
      child.bioMaps = {
        left: this.state.bioMaps[i],
        right: this.state.bioMaps[i+1]
      };
      //console.log(child.bioMaps);
      cursor += childWidth;
    });
  }

}
