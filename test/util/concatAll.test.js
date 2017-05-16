import {assert, expect} from 'chai';
import '../../src/util/concatAll';

describe('concatAll test', () => {
  it('ok', () => {
    assert(Array.prototype.concatAll);
    const input = [
      [1,2,3],
      ['foo','bar','bla'],
    ];
    const expected = [ 1, 2, 3, 'foo', 'bar', 'bla' ];
    const output = input.concatAll();
    expect(output).to.eql(expected);
  });
});
