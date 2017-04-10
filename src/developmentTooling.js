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
    let msg = JSON.stringify(data);
    console.log(`[${topic}] ${msg}`);
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
