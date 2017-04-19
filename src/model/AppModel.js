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

    // tools: pojo w/ properties
    this.tools = {
      zoomFactor : 1,
      layout: HorizontalLayout // the default layout
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

  reset() {
    console.log('reset state'); // TODO: implement reset of application model
  }
}
