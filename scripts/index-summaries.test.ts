import type { Dirent } from 'node:fs';
import fs from 'node:fs/promises';

import { turso } from '~lib/turso';

import { readFile } from './helpers';
import { indexSummaries } from './index-summaries';

jest.mock('node:fs/promises');
jest.mock('~lib/turso');

jest.mock<typeof import('./helpers')>('./helpers', () => ({
    ...jest.requireActual('./helpers'),
    readFile: jest.fn(),
}));

jest.mock<typeof import('ora')>('ora', () => ({
    __esModule: true,
    default: jest.fn().mockReturnValue({
        start: jest.fn(),
        succeed: jest.fn(),
        text: jest.fn(),
    }),
    oraPromise: jest.fn(),
    spinners: {} as any,
}));

describe('indexSummaries', () => {
    beforeAll(() => {
        jest.spyOn(process, 'cwd').mockReturnValue('/Users/me/project');

        jest.mocked(fs.readdir).mockResolvedValue([
            'test-file',
        ] as unknown as Dirent[]);

        jest.mocked(readFile).mockResolvedValue(
            `---\ntitle: Test\ncreated: '2024-01-01'\nupdated: '2024-01-01'\n---\n\n# Test`,
        );
    });

    it('calls fs.readdir', async () => {
        await indexSummaries();

        expect(fs.readdir).toHaveBeenCalledTimes(1);
        expect(fs.readdir).toHaveBeenCalledWith(
            '/Users/me/project/src/content/summaries',
        );
    });

    it('calls turso.batch', async () => {
        await indexSummaries();

        expect(turso.batch).toHaveBeenCalledTimes(1);
        expect(turso.batch).toHaveBeenCalledWith(
            [
                {
                    args: [
                        'test-file',
                        'Test',
                        expect.any(String),
                        expect.any(String),
                    ],
                    sql: 'INSERT INTO summaries (filename, title, created, updated) VALUES (?, ?, ?, ?)',
                },
            ],
            'write',
        );
    });
});
