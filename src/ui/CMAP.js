/**
  * CMAP
  */
import m from 'mithril';
import {AppModel} from './../model/AppModel';
import {UI} from './UI';

/* istanbul ignore next: mithril-query does not work with m.mount, and dom id is hardcoded as well */
export class CMAP {

  load() {
    this.rootElement = document.getElementById('cmap-ui');
    this.appState = new AppModel({});
    this.UI = new UI(this.appState);
    m.mount(this.rootElement, this.UI);

    this.appState.status = 'loading configuration file...';
    this.appState.busy = true;

    m.request('cmap.json').then( config => {
      let numSources = config.sources.length;
      let plural = numSources > 1 ? 's': '';
      this.appState.status = `loading ${numSources} data file${plural}...`;
      let promises = this.appState.load(config);
      Promise.all(promises).then( () => {
        this.appState.status = '';
        this.appState.busy = false;
      });
    });
  }
}
