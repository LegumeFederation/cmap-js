import { version } from '../package.json';
import '../node_modules/pubsub-js/src/pubsub'; // creates global PubSub var
import * as topics from './topics';
import { UI } from './ui/UI';
import rbush from 'rbush';


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
