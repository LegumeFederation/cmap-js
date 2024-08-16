import o from "ospec";
import mq from 'mithril-query';
import { isNil } from '../../src/util/isNil.js';

o.spec('isNil test', function () {
  o('ok', function () {
    o(isNil(0)).equals(false);
    o(isNil('')).equals(false);
    o(isNil('foo')).equals(false);
    o(isNil(123)).equals(false);
    o(isNil({})).equals(false);
    o(isNil(null)).equals(true);
    o(isNil(undefined)).equals(true);
  });
});
