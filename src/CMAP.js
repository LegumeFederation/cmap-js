/**
  * CMAP
  */
import PubSub from 'pubsub-js';
import rbush from 'rbush';

import * as topics from './topics';
import {version} from '../package.json';
import {UI} from './ui/UI';

export class CMAP {

  constructor() {
    this.version = version;
    this.ui = new UI();
  }

  init() {
    this._monitorPubSub();
    this.ui.init();
  }

  // subscribe to all pubsub topics, and log to console (just for development)
  _monitorPubSub() {
    let logger = (topic, data) => {
      let msg = JSON.stringify(data);
      console.log(`[${topic}] ${msg}`);
    };
    Object.keys(topics).forEach( t => {
      //console.log(`subscribing to: ${t}`);
      PubSub.subscribe(t, logger);
    });
  }
}
