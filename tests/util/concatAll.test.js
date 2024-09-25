import o from "ospec";
import mq from 'mithril-query';
import '../../src/util/concatAll.js';

o.spec('concatAll test', function () {
  o('ok', function () {
    o(Array.prototype.concatAll).notEquals(undefined);

    const input = [
      [1, 2, 3],
      ['foo', 'bar', 'bla'],
    ];
    const expected = [1, 2, 3, 'foo', 'bar', 'bla'];
    const output = input.concatAll();

    o(output).deepEquals(expected);
  });
});
