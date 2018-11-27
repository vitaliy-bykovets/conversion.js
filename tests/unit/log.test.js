import { error, info } from '../../src/utils/log';

describe('Log', () => {
    test('error logging', () => {
        const fn = jest.fn();
        const msg = 'Sample error message';

        global.console.error = fn;

        error(msg);

        expect(fn).toHaveBeenCalledWith(`conversion.js: ${msg}`);
    });

    test('info logging', () => {
        const fn = jest.fn();
        const msg = 'Sample info message';

        global.console.info = fn;

        info(msg);

        expect(fn).toHaveBeenCalledWith(`conversion.js: ${msg}`);
    });
});