/**
 * development tooling: conditionally run code based on the ENV string,
 * which is interpolated by a plugin in the rollup.config.js.
 */
import PubSub from 'pubsub-js';

import * as topics from './topics';

const monitorPubSub = () => {
  let logger = (topic, data) => {
    // eslint-disable-next-line no-console
    console.log(`[${topic}]`, data);
  };
  Object.keys(topics).forEach(t => {
    //console.log(`subscribing to: ${t}`);
    PubSub.subscribe(t, logger);
  });
};

if (ENV !== 'production') {
  PubSub.immediateExceptions = true;
  monitorPubSub();
}
