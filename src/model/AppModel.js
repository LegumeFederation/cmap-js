/**
 * App state - a global app state, which can be referenced, viewed or lensed, by
 * various UI components. UI components should have only state needed for their
 * specific function, and should not cache, synchronize or duplicate data.
 */
import {HorizontalLayout} from '../ui/layout/HorizontalLayout';
import {BioMapModel} from './BioMapModel';
import {CorrespondenceMapModel} from './CorrespondenceMapModel';

export class AppModel {

  constructor() {

    // tools: pojo w/ properties
    this.tools = {
      zoomFactor : 1,
      layout: HorizontalLayout,
      devNumberOfMaps: 3
    };

    // TODO: a Set of DataSourceModel
    this.dataSources = {
    };

    // TODO:  biomaps and correspondence maps would be created after loading some
    // data source(s)
    // a Set of BioMapModel
    this.bioMaps = [
      new BioMapModel(),
      new BioMapModel(),
      new BioMapModel()
    ];

    // TODO: a Set of CorrespondenceMap model
    this.correspondenceMaps = [
      new CorrespondenceMapModel(),
      new CorrespondenceMapModel(),
      new CorrespondenceMapModel()
    ];
  }

  get allMaps() {
    return [].concat(this.bioMaps, this.correspondenceMaps);
  }

  reset() {
    console.log('reset state'); // TODO: implement reset
  }
}
