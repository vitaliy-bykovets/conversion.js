import { mergeOptions } from '../../src/utils/object';
import { isFunction } from '../../src/utils/type';

describe('Utils', () => {
  test('object merging', () => {
    const merged = mergeOptions({
      containerToSearchLinks: 'body',
      saveBack: true,
    }, {
      delayContentInsert: false,
      saveBack: false
    });

    expect(merged).toEqual({
      containerToSearchLinks: 'body',
      delayContentInsert: false,
      saveBack: false
    });
  });

  test('function checking', () => {
    const isFunc = isFunction(function() {});

    expect(isFunc).toEqual(true);
  });
});