import {assert} from 'chai';
import {isNil} from '../../src/util/isNil';

describe('isNil test', function () {
  it('ok', function () {
    assert(!isNil(0));
    assert(!isNil(''));
    assert(!isNil('foo'));
    assert(!isNil(123));
    assert(!isNil({}));
    assert(isNil(null));
    assert(isNil(undefined));
  });
});
