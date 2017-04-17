/**
 * App state - a global app state (or model), which can be referenced, viewed or
 * lensed, by various UI components. UI components should have only state needed
 * for their specific function, and should not cache, synchronize or duplicate
 * data.
 */
import {HorizontalLayout} from '../ui/layout/HorizontalLayout';
import {BioMapModel} from './BioMapModel';

export class AppModel {

  constructor() {

    // tools: pojo w/ properties
    this.tools = {
      zoomFactor : 1,
      layout: HorizontalLayout,
      devNumberOfMaps: 3
    };

    // TODO: a Set of DataSourceModels
    this.dataSources = {
    };

    this.bioMaps = [
      new BioMapModel(),
      new BioMapModel(),
      new BioMapModel()
    ];

    // biomaps can be multi-selected by click or tap
    this.selection = {
      bioMaps: []
    };
  }

  get allMaps() {
    return [].concat(this.bioMaps, this.correspondenceMaps);
  }

  reset() {
    console.log('reset state'); // TODO: implement reset of application model
  }
}
