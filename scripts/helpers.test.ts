import fs from 'node:fs/promises';

import { readFile, toISOString, writeFile } from './helpers';

jest.mock('node:fs/promises');
jest.mock('~lib/turso');

describe('toISOString', () => {
    describe('when the date is in the format yyyy-MM-dd', () => {
        const date = '2020-01-01';

        it('returns the date in ISO format', () => {
            expect(toISOString(date)).toBe('2020-01-01T00:00:00.000Z');
        });
    });

    describe('when the date is not in the format yyyy-MM-dd', () => {
        const date = '01-01-2020';

        it('throws an error', () => {
            expect(() => toISOString(date)).toThrow(
                'Date (01-01-2020) does not match format (YYYY-MM-DD)',
            );
        });
    });
});

describe('readFile', () => {
    it('calls readFile from fs/promises with the correct arguments', async () => {
        await readFile('test-file');

        expect(fs.readFile).toHaveBeenCalledTimes(1);
        expect(fs.readFile).toHaveBeenCalledWith('test-file', 'utf8');
    });
});

describe('writeFile', () => {
    it('calls writeFile from fs/promises with the correct arguments', async () => {
        await writeFile('test-file', 'contents');

        expect(fs.writeFile).toHaveBeenCalledTimes(1);
        expect(fs.writeFile).toHaveBeenCalledWith(
            'test-file',
            'contents',
            'utf8',
        );
    });
});
