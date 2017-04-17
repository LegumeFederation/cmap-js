/**
 * development tooling: conditionally run code based on the ENV string,
 * which is interpolated by a plugin in the rollup.config.js.
 */
import PubSub from 'pubsub-js';

import * as topics from './topics';

const livereload = () => {
  document.write(
    '<script src="http://' + (location.host || 'localhost').split(':')[0] +
    ':35729/livereload.js?snipver=1"></' + 'script>'
  );
};

const monitorPubSub = () => {
  let logger = (topic, data) => {
    console.log(`[${topic}]`, data);
  };
  Object.keys(topics).forEach( t => {
    //console.log(`subscribing to: ${t}`);
    PubSub.subscribe(t, logger);
  });
};

if (ENV !== 'production') {
  livereload();
  monitorPubSub();
}
