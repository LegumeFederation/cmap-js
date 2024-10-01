global.window = Object.assign(
  require('../../node_modules/mithril/test-utils/domMock.js')(),
  require('../../node_modules/mithril/test-utils/pushStateMock')(),
);
const mock = require('../../node_modules/mithril/test-utils/browserMock')(global);
global.document = mock.document;
export default require('mithril-query');
