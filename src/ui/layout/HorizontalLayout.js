/**
  * HorizontalLayout (left to right)
  * A mithril component for horizontal layout of BioMaps.
  */
import m from 'mithril';
import {mix} from '../../../mixwith.js/src/mixwith';
import PubSub from 'pubsub-js';

import {dataLoaded, mapAdded, mapRemoved, reset, featureUpdate} from '../../topics';
import {LayoutBase} from './LayoutBase';
import {Bounds} from '../../model/Bounds';
import {BioMap as BioMapComponent} from '../../canvas/layout/BioMap';
import {CorrespondenceMap as CorrMapComponent} from '../../canvas/layout/CorrespondenceMap';
import {QtlTrack} from '../../canvas/layout/QtlTrack';
import {Popover} from '../menus/Popover';
import {FeatureMenu} from '../menus/Feature';
import {RegisterComponentMixin} from '../RegisterComponentMixin';

export class HorizontalLayout
       extends mix(LayoutBase)
       .with(RegisterComponentMixin) {

  // constructor() - prefer do not use in mithril components

  /**
   * mithril lifecycle method
   */
  oninit(vnode) {
    super.oninit(vnode);
    this.bioMapComponents = [];
    this.correspondenceMapComponents = [];
    this.popoverComponents=[];
		this.swapComponents=[];
    this.featureControls=[];
    this.modal=[];
    const handler = () => this._onDataLoaded();
    this.subscriptions = [
      // all of these topics have effectively the same event handler for
      // the purposes of horizontal layout.
      PubSub.subscribe(dataLoaded, handler),
      PubSub.subscribe(mapRemoved, handler),
      PubSub.subscribe(mapAdded, handler),
      PubSub.subscribe(reset,() => { this._onReset();}),
      PubSub.subscribe(featureUpdate, ()=>{this._onFeatureUpdate();})
    ];
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
  view() {
    console.log('view!',this.modal);
    return m('div.cmap-layout-horizontal',
       [this.swapComponents,this.bioMapComponents.map(m),this.featureControls,this.modal.map(modal =>{ return m(modal,{info:modal.info, bounds: modal.bounds, order:modal.order}); }),this.correspondenceMapComponents.map(m),
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

	_layoutSwapComponents(){
		this.swapComponents = [];
    let n = this.bioMapComponents.length;
		let maps = this;
    for (var i = 0; i < n; i++) {
			let bMap = this.bioMapComponents[i];
      console.log('swap test',bMap);
			const b = i;
			let left ='',right='';
			if(b>0){
				left = m('div', {class:'swap-map-order', onclick: function() {
          if(b > 0){
						const tmp = maps.appState.bioMaps[b-1];
						maps.appState.bioMaps[b-1] = maps.appState.bioMaps[b];
						maps.appState.bioMaps[b] = tmp;
						maps._onDataLoaded();
					}
        }
        },'<');
			} else {
				left = m('div', {class:'swap-map-order',style:'background:#ccc;'},'<');
      }

			if(b< n-1){
					right = m('div', {class:'swap-map-order', onclick: function() {
						if(b < n-1){
							const tmp = maps.appState.bioMaps[b];
							maps.appState.bioMaps[b] = maps.appState.bioMaps[b+1];
							maps.appState.bioMaps[b+1] = tmp;
							maps._onDataLoaded();
            }
          }},'>');
      } else {
        right = m('div', {class:'swap-map-order',style:'background:#ccc;'},'>');
      }
	
			this.swapComponents.push( m('div', {
        class: 'swap-div', id: `swap-${i}`,
        style: `position:absolute; left: ${Math.floor(bMap.domBounds.right-bMap.domBounds.width*.75)}px; top: ${bMap.domBounds.top}px;`},
				[left,m('div',{class:'map-title',style:'display:inline-block;'}, [bMap.model.name,m('br'),bMap.model.source.id]), right]));
		}
		
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
                      maps.modal = [];
                      let component = new FeatureMenu();
                      component.info = featureGroup;
                      component.bounds = maps.bounds;
                      component.order = i;
                      maps.modal[0] = component;
                      m.redraw();
                    }
                  },`track-${i}`)
              ); 
              console.log( "featureControls child children", child.children[i]);
            }
          }
		    }
      });
    });
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
    this.bioMapComponents = this.appState.bioMaps.map( (model,mapIndex) => {
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
      console.log('updated width?', component.domBounds.width, model.component.domBounds.width, layoutBounds.width);
      cursor += component.domBounds.width + padding;
      console.log('map children', component.children);
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
  
  _onFeatureUpdate(msg,data){
    this._onDataLoaded;
    this._onDataLoaded;
  }

}
