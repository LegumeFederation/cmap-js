global.window = Object.assign(
  require('mithril/test-utils/domMock.js')(),
  require('mithril/test-utils/pushStateMock')(),
);
const mock = require('mithril/test-utils/browserMock')(global);
global.document = mock.document;
export default require('mithril-query');
