import html from '../fixtures/html';
import Conversion from '../../dist/conversion';

describe('Conversion.js event', () => {
  let conversion;

  beforeEach(()=> {
    document.body.innerHTML = html;
    conversion = new Conversion();
  });

  test('init event should be called', () => {
    const initStarted = jest.fn();
    const initFinished = jest.fn();

    conversion.on('init.started', initStarted);
    conversion.on('init.finished', initFinished);

    conversion.init();

    expect(initStarted).toHaveBeenCalled();
    expect(initFinished).toHaveBeenCalled();
  })
});