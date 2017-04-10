import mq from './mithrilQuerySetup';
import {UI} from '../../src/ui/UI';

describe('UI component', () => {
  it('should generate appropriate output', () => {
    let component = new UI();
    let output = mq(component);
    output.should.have('div');
    // TODO: finish test
  });
});
