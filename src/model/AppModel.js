/**
 * App state - a global app state (or model), which can be referenced, viewed or
 * lensed, by various UI components. UI components should have only state needed
 * for their specific function, and should not cache, synchronize or duplicate
 * data from the app state.
 */
import {HorizontalLayout} from '../ui/layout/HorizontalLayout';
import {BioMapModel} from './BioMapModel';

export class AppModel {

  constructor() {
    // sources and bioMaps arrays will be populated in init()
    this.sources = [];
    this.bioMaps = [ new BioMapModel(), new BioMapModel(), new BioMapModel() ];
    this.tools = {
      zoomFactor : 1,
      layout: HorizontalLayout // the default layout
    };
    this.selection = {
      // biomaps can be multi-selected by click or tap
      bioMaps: []
    };
  }

  init({header, attribution, sources}) {
    this.header = header;
    this.attribution = attribution;
    this.sources = sources;
    // TODO: fetch all data sources and popupate this.bioMaps;
  }

  reset() {
    console.log('reset state'); // TODO: implement reset of application model
  }
}
