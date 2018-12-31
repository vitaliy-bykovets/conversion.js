import html from '../fixtures/html';
import defaultOptions from '../../src/defaults';
import { mergeOptions } from '../../src/utils/object';
import Conversion from '../../dist/conversion';

describe('Conversion.js Instance', () => {

  beforeEach(()=> {
    document.body.innerHTML = html;
  });

  test('should query links', () => {
    const conversion = new Conversion().init();

    expect(conversion.links.length).toBeGreaterThan(0);
  });

  test('should save current url', () => {
    const conversion = new Conversion().init();
    const url = window.location.href;

    expect(conversion.oldLinks[0]).toEqual(url);
  });

  test('should be enabled after initialization', () => {
    const conversion = new Conversion().init();

    expect(conversion.disabled).toBeFalsy();
  });

  test('should set extended options', () => {
    const extendedOptions = {
      containerToInsert: '.js-insert',
      containerToSearchLinks: 'body',
      disableAttribute: 'data-disable'
    };
    const conversion = new Conversion(extendedOptions).init();

    expect(conversion.options).toEqual(mergeOptions(defaultOptions, extendedOptions));
  });
});