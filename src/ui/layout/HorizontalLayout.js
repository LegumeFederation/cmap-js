/**
  * HorizontalLayout (left to right)
  * A mithril component for horizontal layout of BioMaps.
  */
import m from 'mithril';
import {mix} from '../../../mixwith.js/src/mixwith';
import PubSub from 'pubsub-js';

import {dataLoaded, mapAdded, mapRemoved, mapReorder, reset, featureUpdate} from '../../topics';
import {LayoutBase} from './LayoutBase';
import {Bounds} from '../../model/Bounds';
import {BioMap as BioMapComponent} from '../../canvas/layout/BioMap';
import {CorrespondenceMap as CorrMapComponent} from '../../canvas/layout/CorrespondenceMap';
import {QtlTrack} from '../../canvas/layout/QtlTrack';
import {Popover} from '../menus/Popover';
import {FeatureMenu} from '../menus/FeatureMenu';
import {RegisterComponentMixin} from '../RegisterComponentMixin';
import {TitleComponent} from './components/TitleComponent';
import {BioMapComponent as BioMapVnode} from './components/BioMapComponent';


export class HorizontalLayout
       extends mix(LayoutBase)
       .with(RegisterComponentMixin) {

  // constructor() - prefer do not use in mithril components

  /**
   * mithril lifecycle method
   */
  oninit(vnode) {
    super.oninit(vnode);
    this.contentBounds = vnode.attrs.contentBounds;
    this.vnode = vnode;
    this.bioMapComponents = [];
    this.correspondenceMapComponents = [];
    this.popoverComponents=[];
		this.swapComponents=[];
    this.featureControls=[];
    this.modal=[];
    this.bioMapOrder = [];
    this.test = 0;
    const handler = () => this._onDataLoaded();
    this.subscriptions = [
      // all of these topics have effectively the same event handler for
      // the purposes of horizontal layout.
      PubSub.subscribe(dataLoaded, handler),
      PubSub.subscribe(mapRemoved, handler),
      PubSub.subscribe(mapAdded, handler),
      PubSub.subscribe(reset,() => { this._onReset();}),
      PubSub.subscribe(featureUpdate, (msg,data)=>{this._onFeatureUpdate(data);}),
      PubSub.subscribe(mapReorder, ()=>{this._onReorder()})
    ];
  }

  onupdate(vnode){
    this.contentBounds = vnode.attrs.contentBounds;
  }
    

  /**
   * mithril lifecycle method
   */
  onremove() {
    this.subscriptions.forEach( token => PubSub.unsubscribe(token) );
  }

  /**
   * mithril component render method
   */
  view(vnode) {
    //m.mount(document.getElementById('cmap-layout-titles'),null);
    let mo = this.bioMapOrder.map(i => {return this.bioMapComponents[i]});
    console.log("testing butts", mo);
    return m('div.cmap-layout-horizontal',
       [//this.swapComponents,
       this.bioMapOrder.map((i)=>{
         console.log("onLayout bmaps", i, this.bioMapComponents[i]);
         return m(BioMapVnode,{bioMap:this.bioMapComponents[i]})}),this.featureControls,
       //this.modal.map(modal =>{ return m(modal,{info:modal.info, bounds: modal.bounds, order:modal.order}); }),
       this.correspondenceMapComponents.map(m),
        this.popoverComponents.map(popover =>{ return m(popover,{info:popover.info, domBounds:popover.domBounds});})]
    );
  }

  /**
   * pub/sub event handler
   */
  _onDataLoaded() {
    this._layoutBioMaps();
    this._layoutSwapComponents();
    this._layoutFeatureControls();
    this._layoutCorrespondenceMaps();
    this._layoutPopovers();
    m.redraw();
  }
  _onReorder(){
    console.log("onLayout Reorder",this.bioMapOrder);
    let left = 0;
    let bmaps = this.bioMapComponents
    let sc = this.bioMapOrder;
    bmaps.forEach(comp => {comp.dirty = true})
    for(let i=0; i < bmaps.length; i++){
      let map = bmaps[sc[i]];
      const mapC = bmaps[sc[i]].domBounds;
      const mw = map.domBounds.width;
      map.domBounds.left = left;
      map.domBounds.right = left+ mw;
      left = map.domBounds.right;
    }
    this._layoutCorrespondenceMaps();
    this._layoutFeatureControls();
    m.mount(document.getElementById('cmap-layout-titles'),null);
    m.redraw();
    this._layoutSwapComponents();
  }

	_layoutSwapComponents(){
    console.log("onLayout",this.bioMapOrder);
		this.swapComponents = [];
    let sc = this.bioMapOrder;
		let maps = this;
    let cb = this.contentBounds;
    let bmaps = this.bioMapComponents;
    let pan = [];
    pan[0] = false;
    m.mount(document.getElementById('cmap-layout-titles'),{ 
      view: function(){ 
      return sc.map((order)=>{console.log("onLayout comp", order, bmaps[order].model.name); return m(TitleComponent,{bioMaps:maps.bioMapComponents,order:order,titleOrder:sc,contentBounds:cb,pan:pan})})
    }});
		
	}

	_layoutFeatureControls(){
		this.featureControls = [];
    let n = this.bioMapComponents.length;
		let maps = this;
    this.bioMapComponents.forEach( component => {
      component.children.forEach( child => {
        if( child instanceof QtlTrack){
          for( let i = 0; i < child.children.length; i++){
            if(child.children[i].bounds.width > 0){
              let featureGroup = child.children[i];
			        this.featureControls.push( 
                m('div', {
                  class: 'feature-title',
                  id: `feature-${component.model.name}-${i}`,
                    style: `position:absolute; left: ${Math.floor(component.domBounds.left + featureGroup.globalBounds.left)}px; 
                      top: ${component.domBounds.top}px; width: ${featureGroup.globalBounds.width}px;`,
                    onclick: function(){
                        let info = child.children[0];
                        let order = i;
                        new FeatureMenu(info,order);
                    }
                  }, featureGroup.tags[0])
              ); 
            }
          }
          // push controller to add new track
			    this.featureControls.push( 
                m('div', {
                  class: 'feature-title',
                  id: `feature-${component.model.name}-new`,
                    style: `position:absolute; left: ${Math.floor(component.domBounds.left + child.globalBounds.right + 20)}px; 
                      top: ${component.domBounds.top}px; width: 20px;`,
                    onclick: function(){
                      let info = child.children[0];
                      let order = child.children.lenght;
                      new FeatureMenu(info,order);
                    }
                  },`+`)
              );
		    }
      });
    });
	}
  /**
   * Horizonal (left to right) layout of BioMaps
   */
  _layoutBioMaps() {
    console.log('appState',this.appState.bioMaps);
    if(! this.bounds) return []; // early out if the layout bounds is unknown
    let n = this.appState.bioMaps.length;
    let padding = Math.floor(this.bounds.width * 0.1 / n);
    padding = 0; // TODO: decide whether to add padding between the biomaps
    let childHeight = Math.floor(this.bounds.height * 0.95);
    let cursor = Math.floor(padding * 0.5);
    this.bioMapComponents = this.appState.bioMaps.map( (model,mapIndex) => {
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
        bioMapIndex: mapIndex
      });
      model.component = component; // save a reference for mapping model -> component
      cursor += component.domBounds.width + padding;
      return component;
    });

  }
  _layoutPopovers(){
    this.popoverComponents = this.bioMapComponents.map( model => {
      let component = new Popover();
      component.info = model.info;
      component.domBounds = model.domBounds;
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
        left: Math.floor(left.domBounds.left+left.backbone.globalBounds.right),
        right: Math.floor(right.domBounds.left+right.backbone.globalBounds.left),
        top: 10,
        height: childHeight
      });
      let component = new CorrMapComponent({
        bioMapComponents: [ left, right ],
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
   *
   */
  _onReset(){
    this.bioMapComponents.forEach(item => {
      item.model.view.visible = item.model.view.base;
      item.verticalScale = 1.0;
      item.info.visible = 'hidden';
    });
    [].forEach.call(document.getElementsByClassName('cmap-canvas'), el =>{
       el.mithrilComponent.draw();
    });
    m.redraw();
  }
  
  _onFeatureUpdate(data){
    this.bioMapComponents[data.mapIndex]._layout();
    m.redraw();
    this._onReorder();
  }

}
