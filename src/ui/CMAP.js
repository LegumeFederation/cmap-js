/**
 * CMAP
 */

import m from 'mithril';

import {AppModel} from './../model/AppModel';
import {UI} from './UI';
import Query from './../util/QueryControl';

/* istanbul ignore next: mithril-query does not work with m.mount, and dom id is hardcoded as well */
export class CMAP {

  /**
   *
   * @param configURL
   */

  load(configURL) {
    this.rootElement = document.getElementById('cmap-ui');
    this.appState = new AppModel({});
    this.UI = new UI(this.appState);
    m.mount(this.rootElement, this.UI);

    if (configURL === null) {
      configURL = 'cmap.json';
    }

    this.appState.status = 'loading configuration file...';
    this.appState.busy = true;

    m.request(configURL).then(config => {
      let numSources = config.sources.length;
      let plural = numSources > 1 ? 's' : '';

      this.appState.status = `loading ${numSources} data file${plural}...`;

      let promises = this.appState.load(config);
      Promise.all(promises).then(() => {
        let queryString = Query;
        this.appState = queryString.stateFromQuery(this.appState);
        this.appState.status = '';
        this.appState.busy = false;
      });
    }).catch(err => {
      // TODO: make a nice mithril component to display errors in the UI
      console.error(err);
      console.trace();
      alert(`While fetching cmap.json config file, ${err}`);
    });
  }
}
