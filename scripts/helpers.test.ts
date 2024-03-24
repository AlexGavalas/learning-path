import fs from 'node:fs/promises';

import { turso } from '~lib/turso';

import { readFile, toISOString, updateEdgeConfig, writeFile } from './helpers';

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
            expect(() => toISOString(date)).toThrow('Invalid time value');
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

describe('updateEdgeConfig', () => {
    beforeAll(() => {
        jest.mocked(turso).execute.mockResolvedValue({
            columns: [],
            columnTypes: [],
            lastInsertRowid: undefined,
            rows: [],
            rowsAffected: 0,
            toJSON: jest.fn(),
        });

        process.env.EDGE_CONFIG_ID = 'test-edge-config-id';
        process.env.VERCEL_ACCESS_TOKEN = 'test-vercel-access-token';
    });

    it('calls turso.execute', async () => {
        await updateEdgeConfig();

        expect(turso.execute).toHaveBeenCalledTimes(1);
        expect(turso.execute).toHaveBeenCalledWith(
            'SELECT DISTINCT(title), filename, created, updated FROM notes ORDER BY updated DESC, title ASC',
        );
    });

    it('calls fetch', async () => {
        await updateEdgeConfig();

        const edgeConfig = process.env.EDGE_CONFIG_ID;
        const vercelAccessToken = process.env.VERCEL_ACCESS_TOKEN;

        const url = `https://api.vercel.com/v1/edge-config/${edgeConfig}/items`;

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(url, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${vercelAccessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                items: [
                    {
                        operation: 'update',
                        key: 'meta',
                        value: [],
                    },
                ],
            }),
        });
    });
});
