import mq from './mithrilQuerySetup';
import {UI} from '../../src/ui/UI';

describe('UI component', function() {
  it('should generate appropriate output', function() {
    let component = new UI();
    let out = mq(component);
    out.should.have('div.cmap-layout.cmap-vbox > div.cmap-layout-viewport.cmap-hbox');
  });
});
