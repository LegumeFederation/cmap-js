/**
 * Test the Reset button
 */
import mq from '../mithrilQuerySetup';
import PubSub from 'pubsub-js';

import {Reset as ResetComponent} from '../../../src/ui/tools/Reset';
import {reset as resetTopic} from '../../../src/topics';

describe('Reset button', () => {

  it('should generate appropriate output', () => {
    const component = new ResetComponent();
    const out = mq(component);
    out.should.have('button');
    out.should.have('i.material-icons');
    out.should.contain('Reset');
  });

  it('should publish a PubSub reset event', () => {
    // eslint-disable-next-line no-unused-vars
    const p = new Promise( (resolve, reject) => {
      const component = new ResetComponent();
      const out = mq(component);
      PubSub.subscribe(resetTopic, resolve);
      out.click('button');
    });
    return p;
  });
});
