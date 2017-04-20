/**
  * HorizontalLayout (left to right)
  * A mithril component for horizontal layout of BioMaps.
  */
import m from 'mithril';
import {mix} from '../../../mixwith.js/src/mixwith';

import {LayoutBase} from './LayoutBase';
import {Bounds} from '../../model/Bounds';
import {BioMap as BioMapComponent} from '../../canvas/BioMap';
import {CorrespondenceMap as CorrMapComponent} from '../../canvas/CorrespondenceMap';
import {RegisterComponentMixin} from './RegisterComponentMixin';

export class HorizontalLayout
       extends mix(LayoutBase)
       .with(RegisterComponentMixin) {

  // constructor() - prefer do not use in mithril components

  oninit(vnode) {
    super.oninit(vnode);
    this.bioMapComponents = [];
    this.correspondenceMapComponents = [];
  }

  oncreate(vnode) {
    super.oncreate(vnode);
    // now this.bounds are known, so the child maps can be layouted
    this._layoutBioMaps();
    this._layoutCorrespondenceMaps();
    m.redraw();
  }

  /**
   * mithril component render method
   */
  view() {
    return m('div', {
      class: 'cmap-layout-horizontal'
    },
    [].concat(this.bioMapComponents, this.correspondenceMapComponents).map(m)
    );
  }

  /**
   * Horizonal (left to right) layout of BioMaps
   */
  _layoutBioMaps() {
    if(! this.bounds) return []; // early out if the layout bounds is unknown
    let n = this.appState.bioMaps.length;
    let padding = Math.floor(this.bounds.width * 0.1 / n);
    padding = 0; // TODO: decide whether to add padding between the biomaps
    let childHeight = Math.floor(this.bounds.height * 0.95);
    let cursor = Math.floor(padding * 0.5);
    this.bioMapComponents = this.appState.bioMaps.map( model => {
      let layoutBounds = new Bounds({
        left: cursor,
        top: 10,
        width: 0, // will be calculated by bioMap
        height: childHeight
      });
      let component = new BioMapComponent({
        model,
        layoutBounds,
        appState: this.appState,
      });
      model.component = component; // safe a reference for mapping model -> component
      cursor += component.domBounds.width + padding;
      return component;
    });
  }

  /**
   * Horizontal layout of Correspondence Maps. In this layout, for N maps there
   * are N -1 correspondence maps.
   */
  _layoutCorrespondenceMaps() {
    if(! this.bounds) return []; // early out if our canvas bounds is unknown
    let childHeight = Math.floor(this.bounds.height * 0.95);
    let n = this.bioMapComponents.length;
    this.correspondenceMapComponents = [];
    for (var i = 0; i < n-1; i++) {
      let left = this.bioMapComponents[i];
      let right = this.bioMapComponents[i+1];
      let layoutBounds = new Bounds({
        left: Math.floor(left.domBounds.right - left.domBounds.width * 0.5),
        right: Math.floor(right.domBounds.left + right.domBounds.width * 0.5),
        top: 10,
        height: childHeight
      });
      let component = new CorrMapComponent({
        bioMapComponents: [ left, right ],
        layoutBounds: layoutBounds
      });
      this.correspondenceMapComponents.push(component);
    }
  }

}
