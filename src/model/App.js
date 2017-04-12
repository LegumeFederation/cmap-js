/**
 * App state - a global app state, which can be referenced, viewed or lensed, by
 * various UI components. UI components should have only state needed for their
 * specific function, and should not cache, synchronize or duplicate data.
 */
import {HorizontalLayout} from '../ui/layout/HorizontalLayout';

export class App {

  constructor() {
    // these could be converted to ES6 classes, but the whole application
    // state is sketched out here:
    this.tools = {
      zoomFactor : 1,
      layout: HorizontalLayout,
      devNumberOfMaps: 3
    };
    this.dataSources = {
    };
    // biomaps and correspondence maps would be created after loading some
    // data source(s)
    this.bioMaps = {
      mapA : {
      },
      mapB : {
      },
      mapC : {
      },
      // etc.
    };
    this.correspondenceMaps = {
      'mapA<->B' : {
        left : this.bioMaps.mapA,
        right: this.bioMaps.mapB
      },
      'mapB<->C' : {
        left: this.bioMaps.mapB,
        right: this.bioMaps.mapC
      },
      // etc.
    };
  }

  get allMaps() {
    return [].concat(this.bioMaps, this.correspondenceMaps);
  }
}
