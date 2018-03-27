/**
 * Test the Reset button
 */
import mq from '../mithrilQuerySetup';
import PubSub from 'pubsub-js';

import {ResetButton} from '../../../src/ui/tools/ResetButton';
import {reset as resetTopic} from '../../../src/topics';

describe('Reset button', function () {

  it('should generate appropriate output', function () {
    const component = new ResetButton();
    const out = mq(component);
    out.should.have('button');
    out.should.have('i.material-icons');
    out.should.contain('Reset');
  });

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
});
