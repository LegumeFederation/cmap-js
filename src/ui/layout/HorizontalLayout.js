/**
 * HorizontalLayout (left to right)
 * A mithril component for horizontal layout of BioMaps.
 */
import m from 'mithril';
import * as mixwith from '../../../mixwith.js/src/mixwith.mjs';
const { mix } = mixwith;
import PubSub from 'pubsub-js';

import {dataLoaded, mapAdded, mapRemoved, mapReorder, reset, featureUpdate} from '../../topics.js';
import {LayoutBase} from './LayoutBase.js';
import {Bounds} from '../../model/Bounds.js';
import {BioMap as BioMapComponent} from '../../canvas/canvas/BioMap.js';
import {CorrespondenceMap as CorrMapComponent} from '../../canvas/canvas/CorrespondenceMap.js';
import {FeatureTrack} from '../../canvas/layout/FeatureTrack.js';
import {Popover} from '../menus/Popover.js';
import {FeatureMenu} from '../menus/FeatureMenu.js';
import {RegisterComponentMixin} from '../RegisterComponentMixin.js';
import {TitleComponent} from './components/TitleComponent.js';
import {BioMapComponent as BioMapVnode} from './components/BioMapComponent.js';

export class HorizontalLayout
  extends mix(LayoutBase)
    .with(RegisterComponentMixin) {

  // constructor() - prefer do not use in mithril components

  /**
   * mithril lifecycle method
   * @param vnode
   */

  oninit(vnode) {
    super.oninit(vnode);
    this.contentBounds = vnode.attrs.contentBounds;
    this.vnode = vnode;
    this.bioMapComponents = [];
    this.correspondenceMapComponents = [];
    this.popoverComponents = [];
    this.swapComponents = [];
    this.featureControls = [];
    this.modal = [];
    this.bioMapOrder = [];
    this.test = 0;
    const handler = () => this._onDataLoaded();
    this.subscriptions = [
      // all of these topics have effectively the same event handler for
      // the purposes of horizontal layout.
      PubSub.subscribe(dataLoaded, handler),
      PubSub.subscribe(mapRemoved, () =>{
        this.bioMapComponents = [];
        this.bioMapOrder = [];
        this._onDataLoaded();
       // this.bioMapComponents.forEach(component => component.dirty = true);
       // m.redraw();
      }),
      PubSub.subscribe(mapAdded, ()=>{
        this.bioMapComponents = [];
        this.bioMapOrder = [];
        this._onDataLoaded();
      }),
      PubSub.subscribe(reset, () => {
        this._onReset();
      }),
      PubSub.subscribe(featureUpdate, (msg, data) => {
        this._onFeatureUpdate(data);
      }),
      PubSub.subscribe(mapReorder, () => {
        this._onReorder();
      })
    ];
  }

  /**
   *
   * @param vnode
   */

  onupdate(vnode) {
    this.contentBounds = vnode.attrs.contentBounds;
  }

  /**
   * mithril lifecycle method
   */

  onremove() {
    this.subscriptions.forEach(token => PubSub.unsubscribe(token));
  }

  /**
   * mithril component render method
   * @returns {*} mithril vnode
   */

  view() {
   //m.mount(document.getElementById('cmap-layout-titles'),null);
   // let mo = this.bioMapOrder.map(i => {
   //   return this.bioMapComponents[i];
   // });
    return m('div.cmap-layout-horizontal',
      [//this.swapComponents,
        this.correspondenceMapComponents.map(m),
        this.bioMapOrder.map((i) => {
          return m(BioMapVnode, {bioMap: this.bioMapComponents[i]});
        }), this.featureControls,
        //this.modal.map(modal =>{ return m(modal,{info:modal.info, bounds: modal.bounds, order:modal.order}); }),
        this.popoverComponents.map(popover => {
          return m(popover, {info: popover.info, domBounds: popover.domBounds});
        })]
    );
  }

  /**
   * pub/sub event handler
   *
   * @private
   */

  _onDataLoaded() {
    this._layoutBioMaps();
    this._layoutSwapComponents();
    this._layoutFeatureControls();
    this._layoutCorrespondenceMaps();
    this._layoutPopovers();
    m.redraw();
  }

  /**
   *
   * @private
   */

  _onReorder() {
    let left = 0;
    let bmaps = this.bioMapComponents;
    let sc = this.bioMapOrder;
    bmaps.forEach(comp => {
      comp.dirty = true;
    });
    for (let i = 0; i < bmaps.length; i++) {
      let map = bmaps[sc[i]];
      //const mapC = bmaps[sc[i]].domBounds;
      map.domBounds.translate(left - map.domBounds.left,0);
     // const mw = map.domBounds.width;
     // map.domBounds.left = left;
     // map.domBounds.right = left + mw;
      left = map.domBounds.right;
    }
    this._layoutCorrespondenceMaps();
    this._layoutFeatureControls();
    m.mount(document.getElementById('cmap-layout-titles'), null);
    m.redraw();
    this._layoutSwapComponents();
  }

  /**
   *
   * @private
   */

  _layoutSwapComponents() {
    this.swapComponents = [];
    let sc = this.bioMapOrder;
    let maps = this;
    let cb = this.contentBounds;
    //let bmaps = this.bioMapComponents;
    let pan = [];
    pan[0] = false;
    m.mount(document.getElementById('cmap-layout-titles'), {
      view: function () {
        return sc.map((order) => {
          return m(TitleComponent, {
            bioMaps: maps.bioMapComponents,
            order: order,
            titleOrder: sc,
            contentBounds: cb,
            pan: pan
          });
        });
      }
    });

  }

  /**
   *
   * @private
   */

  _layoutFeatureControls() {
    this.featureControls = [];
    //let n = this.bioMapComponents.length;
    //let maps = this;
    this.bioMapComponents.forEach(component => {
      component.children.forEach(child => {
        if (child instanceof FeatureTrack) {
          for (let i = 0; i < child.children.length; i++) {
            if (child.children[i].bounds.width > 0) {
              let featureGroup = child.children[i];
              this.featureControls.push(
                m('div', {
                  class: 'button feature-title',
                  id: `feature-${component.model.name}-${i}`,
                  title: featureGroup.title,
                  style: `left: ${Math.floor(component.domBounds.left + featureGroup.globalBounds.left)}px; 
                      top: ${component.domBounds.top}px; width: ${featureGroup.globalBounds.width}px;`,
                  onclick: function () {
                    let info = child.children[i];
                    info.position = child.trackPos;
                    new FeatureMenu(info, child.children[i].config.tracksIndex);
                  }
                }, featureGroup.title)
              );
            }
          }
          // push controller to add new track
          this.featureControls.push(
            m('div', {
              class: 'button feature-title',
              id: `feature-${component.model.name}-new`,
              title: 'Add new feature',
              style: `left: ${Math.floor(component.domBounds.left + child.globalBounds.right + 15)}px; 
                      top: ${component.domBounds.top}px; padding: 0px 10px;`,
              onclick: function () {
                let info = component.model;
                info.position = child.trackPos;
                let order = child.model.tracks.length;
                new FeatureMenu(info, order);
              }
            }, '+')
          );
        }
      });
    });
  }

  /**
   * Horizontal (left to right) layout of BioMaps
   *
   * @returns {Array}
   * @private
   */

  _layoutBioMaps() {
    if (!this.bounds) return []; // early out if the layout bounds is unknown
    let n = this.appState.bioMaps.length;
    let padding = Math.floor(this.bounds.width * 0.1 / n);
    padding = 0; // TODO: decide whether to add padding between the biomaps
    let childHeight = Math.floor(this.bounds.height * 0.95);
    let cursor = Math.floor(padding * 0.5);
    this.bioMapComponents = this.appState.bioMaps.map((model, mapIndex) => {
      this.bioMapOrder.push(mapIndex);
      let layoutBounds = new Bounds({
        left: cursor,
        top: 10,
        width: Math.floor(this.bounds.width), // will be calculated by bioMap
        height: childHeight
      });
      let component = new BioMapComponent({
        bioMapModel: model,
        layoutBounds: layoutBounds,
        appState: this.appState,
        bioMapIndex: mapIndex,
        initialView : this.appState.initialView[mapIndex] || model.config
      });
      model.component = component; // save a reference for mapping model -> component
      cursor += component.domBounds.width + padding;
      return component;
    });

  }

  /**
   *
   * @private
   */

  _layoutPopovers() {
    this.popoverComponents = this.bioMapComponents.map(model => {
      let component = new Popover();
      component.info = model.info;
      component.domBounds = model.domBounds;
      return component;
    });
  }

  /**
   * Horizontal layout of Correspondence Maps. In this layout, for N maps there
   * are N -1 correspondence maps.
   * @returns {Array}
   * @private
   */

  _layoutCorrespondenceMaps() {
    if (!this.bounds) return []; // early out if our canvas bounds is unknown
    let childHeight = Math.floor(this.bounds.height * 0.95);
    let n = this.bioMapComponents.length;
    this.correspondenceMapComponents = [];
    for (let i = 0; i < n - 1; i++) {
      let left = this.bioMapComponents[this.bioMapOrder[i]];
      let right = this.bioMapComponents[this.bioMapOrder[i + 1]];
      let layoutBounds = new Bounds({
        left: Math.floor(left.domBounds.left + left.backbone.backbone.globalBounds.right),
        right: Math.floor(right.domBounds.left + right.backbone.backbone.globalBounds.left),
        top: 10,
        height: childHeight
      });
      let component = new CorrMapComponent({
        bioMapComponents: [left, right],
        appState: this.appState,
        layoutBounds: layoutBounds
      });
      this.correspondenceMapComponents.push(component);
    }
  }

  /**
   * Reset local zoom here. Easier to iterate through base element
   * and redraw components once from the base layout than deal with
   * it through the individual components.
   * (Difficulty in reaching the mithril component to get canvas context)
   * @private
   */

  _onReset() {
    this.bioMapComponents.forEach(item => {
      item.model.view.visible = item.model.view.base;
      item.verticalScale = 1.0;
      item.info.visible = 'hidden';
    });
    [].forEach.call(document.getElementsByClassName('cmap-canvas'), el => {
      el.mithrilComponent.draw();
    });
    m.redraw();
  }

  /**
   *
   * @param data
   * @private
   */

  _onFeatureUpdate(data) {
    //this._onDataLoaded();
    this.bioMapComponents[data.mapIndex]._layout();
    m.redraw();
    this._onReorder();
  }
}
