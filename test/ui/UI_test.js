import mq from './mithrilQuerySetup';
import {UI} from '../../src/ui/UI';
import {AppModel} from '../../src/model/AppModel';

describe('UI component', function() {
  it('should generate appropriate output', function() {
    const model = new AppModel();
    let component = new UI(model);
    let out = mq(component);
    out.should.have('div.cmap-layout.cmap-vbox');
    out.should.have('div.cmap-layout-viewport.cmap-hbox');
  });
});
