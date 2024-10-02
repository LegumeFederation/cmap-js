import o from 'ospec';
import mq from 'mithril-query';
import { UI } from '../../src/ui/UI.js';
import { AppModel } from '../../src/model/AppModel.js';

o.spec('UI component', function () {
  o('should generate appropriate output', function () {
    const model = new AppModel();
    let component = new UI(model);
    let out = mq(component);
    o(out.has('div.cmap-layout.cmap-vbox')).equals(true);
    o(out.has('div.cmap-layout-viewport.cmap-hbox')).equals(true);
  });
});
