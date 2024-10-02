/**
 * Test the Reset button
 */
import o from 'ospec';
// import PubSub from 'pubsub-js';
import { ResetButton } from '../../../src/ui/tools/ResetButton.js';
// import { reset as resetTopic } from '../../../src/topics.js';
import mq from 'mithril-query';

o.spec('Reset button', function () {
  o('should generate appropriate output', function () {
    const component = new ResetButton();
    const out = mq(component);

    o(out.has('button')).equals(true);
    o(out.has('i.material-icons')).equals(true);
    o(out.contains('Reset')).equals(true);
  });
/* TODO: This test fails if the UI test is also running.
  Comment out the UI test and uncomment this one to run it. 
  it('should publish a PubSub reset event', function () {
    // eslint-disable-next-line no-unused-vars
    const p = new Promise((resolve, reject) => {
      const component = new ResetButton();
      const out = mq(component);
      PubSub.subscribe(resetTopic, resolve);
      out.click('button', {});
    });
    return p;
  });
  */
});

