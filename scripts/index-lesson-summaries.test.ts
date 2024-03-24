import type { Dirent } from 'node:fs';
import fs from 'node:fs/promises';

import { turso } from '~lib/turso';

import { readFile } from './helpers';
import { indexLessonSummaries } from './index-lesson-summaries';

jest.mock('node:fs/promises');
jest.mock('~lib/turso');

jest.mock<typeof import('~api/notes')>('~api/notes', () => ({
    getAllNotes: jest.fn(),
    fetchNotes: jest.fn(),
    getNoteData: jest.fn(),
}));

jest.mock<typeof import('./helpers')>('./helpers', () => ({
    ...jest.requireActual('./helpers'),
    readFile: jest.fn(),
}));

jest.mock<typeof import('ora')>('ora', () => ({
    __esModule: true,
    oraPromise: jest.fn(),
    spinners: {} as any,
    default: jest.fn().mockReturnValue({
        start: jest.fn(),
        succeed: jest.fn(),
        text: jest.fn(),
    }),
}));

describe('indexLessonSummaries', () => {
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
        await indexLessonSummaries();

        expect(fs.readdir).toHaveBeenCalledTimes(1);
        expect(fs.readdir).toHaveBeenCalledWith(
            '/Users/me/project/src/content/lesson-summaries',
        );
    });

    it('calls turso.batch', async () => {
        await indexLessonSummaries();

        expect(turso.batch).toHaveBeenCalledTimes(1);
        expect(turso.batch).toHaveBeenCalledWith(
            [
                {
                    sql: 'INSERT INTO lesson_summaries (filename, title, created, updated) VALUES (?, ?, ?, ?)',
                    args: [
                        'test-file',
                        'Test',
                        expect.any(String),
                        expect.any(String),
                    ],
                },
            ],
            'write',
        );
    });
});
