import {makeObservable, observable, computed, action, autorun} from 'mobx';
import DataStore from './DataStore';
import BioMapStore from './uiStoreComponents/BioMapStore';

export default class UIStore {
  constructor() {
    makeObservable(this, {
      headerMenuVisible: observable,
      mainWindowStatus: observable,
      title: observable,
      dataStore: observable,
      activeMaps: observable.deep,
      mapOrder: observable,
      modal: observable,
      viewport: observable,
      offsetWidth: observable,
      canvasHeight: observable,
      headerMenuState: computed,
      cmapCanvasCount: computed,
      toggleHeaderMenu: action,
      setMainWindowStatus: action,
      addMap: action,
      setTitle:action,
      displayModal: action,
      setViewportSize: action,
      setCanvasHeight: action,
      appendMap:action,
      mainWindow: observable,
      updateMainWindow: action,
      redraw: computed,
    });
    // keep cmap-app viewport bounds up-to-date, but only after window resizing is done
    let done;
    const onResized = () => {
      this.setViewportSize();
    };
    window.onresize=()=>{
      clearTimeout(done);
      done = setTimeout(onResized, 100);
    };
  }
  mainWindow = 0;
  offsetWidth = 0;
  updateMainWindow(elements){
    if(elements){
      let w = 0;
      console.log(elements);
      if(elements && elements[1]) {
        let mult = elements[1].children.length >= 3 ? elements[1].children.length+1 : 3;
        this.offsetWidth = elements[0].offsetWidth*(mult);
      }
    }

    this.updateWidth();
    //  this.mainWindow = w;
  }
  //Toggle dropdown of "hamburger" menu
  headerMenuVisible = false;
  //Format to display in cmap main body (loading, main, error &c)
  mainWindowStatus = 'loading';
  // Displayed title in header bar
  title = 'cmap-js';
  // Loaded Data
  dataStore = new DataStore();
  // Active modal overlay
  modal = '';
  // Actively displayed maps
  activeMaps = {};

  mapOrder = [];
  viewport = {
    height: document.getElementById('cmap-div').clientHeight,
    width: document.getElementById('cmap-div').clientWidth,
  }

  get redraw(){
    return this.mapOrder.some(map => this.activeMaps[map].dirty);
  }

  canvasHeight = 200;

  setCanvasHeight(){
    let canvasTop = 0;
    if(this.dataStore.canvasMaxHeight !== -1){
      this.canvasHeight = this.dataStore.canvasMaxHeight;
      return;
    } else if (this.cmapCanvasCount){
      canvasTop = document.getElementsByClassName('cmap-canvas')[0].getBoundingClientRect().top;
    } else if (document.getElementById('cmap-content')){
      canvasTop = document.getElementById('cmap-content').getBoundingClientRect().top;
    }
    this.canvasHeight = Math.floor(this.viewport.height - canvasTop);
  }

  get cmapCanvasCount(){
    return this.mapOrder.length;
  }

  //TODO: Delete when a valid computed is available
  get headerMenuState () {
    let canvasTop = 0;
    if (this.cmapCanvasCount){
      canvasTop = document.getElementsByClassName('cmap-canvas')[0].getBoundingClientRect().top;
    } else if (document.getElementById('cmap-content')){
      canvasTop = document.getElementById('cmap-content').getBoundingClientRect().top;
    }
    return Math.floor(this.viewport.height - canvasTop);
  }


  /**
   * Toggle if hamburger menu is visible
   */
  toggleHeaderMenu(){
    this.headerMenuVisible = !this.headerMenuVisible;
  }

  /*n*
   * Switch displayed main body
   * @param status
   */
  setMainWindowStatus(status){
    this.mainWindowStatus = status;
  }

  /**
   * Append a visual map to the display
   * @param direction - direction to add map
   * @param bioMap
   */
  addMap(bioMap, direction){
    if (direction) { // d=1 right, d=0 left
      this.mapOrder.push(bioMap);
    } else {
      this.mapOrder = [bioMap].concat(this.mapOrder);
    }
  }

  appendMap(key,map){
    this.activeMaps[key] = map;
  }

  /**
   * Set a new title
   * @param title
   */
  setTitle(title){
    this.title = title;
  }

  displayModal(modal){
    if(this.headerMenuVisible) this.toggleHeaderMenu();
    this.modal = modal;
  }

  setDataStore(store){
    this.dataStore = store;
  }

  setViewportSize() {
    this.viewport = {
      height: document.getElementById('cmap-div').clientHeight,
      width: document.getElementById('cmap-div').clientWidth,
    };
    this.setCanvasHeight();
  }

  updateWidth(){
    let w = this.offsetWidth;
    this.mapOrder.forEach(map =>{
      if(this.activeMaps[map] !== undefined) {
        w += this.activeMaps[map].actualBounds.width;
      }
    });
    this.mainWindow = w || '100%';
  }
}
