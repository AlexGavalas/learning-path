import type { Dirent } from 'fs';
import fs from 'fs/promises';

import { supabase } from '~lib/supabase';

import { getEnvVariable, readFile, uploadFile } from './helpers';
import { indexLessonSummaries } from './index-lesson-summaries';

jest.mock('fs/promises');
jest.mock('~lib/supabase');
jest.mock('./helpers');

describe('indexLessonSummaries', () => {
    beforeAll(() => {
        jest.spyOn(process, 'cwd').mockReturnValue('/Users/me/project');

        jest.mocked(fs.readdir).mockResolvedValue([
            'test-file',
        ] as unknown as Dirent[]);

        jest.mocked(readFile).mockResolvedValue(
            '---\ntitle: Test\n---\n\n# Test',
        );

        jest.mocked(getEnvVariable).mockReturnValue('http://localhost:3000');
    });

    it('calls readdir from fs/promises', async () => {
        await indexLessonSummaries();

        expect(fs.readdir).toHaveBeenCalledTimes(1);
        expect(fs.readdir).toHaveBeenCalledWith('/Users/me/project/summaries');
    });

    it('calls supabase.from', async () => {
        await indexLessonSummaries();

        expect(supabase.from).toHaveBeenCalledTimes(1);
        expect(supabase.from).toHaveBeenCalledWith('lesson_summaries_meta');
    });

    it('calls upsert', async () => {
        await indexLessonSummaries();

        const upsert = supabase.from('whatever').upsert;

        expect(upsert).toHaveBeenCalledTimes(1);
        expect(upsert).toHaveBeenCalledWith({
            filename: 'test-file',
            title: 'Test',
            created: undefined,
            updated: undefined,
        });
    });

    it('calls uploadFile', async () => {
        await indexLessonSummaries();

        expect(uploadFile).toHaveBeenCalledTimes(1);
        expect(uploadFile).toHaveBeenCalledWith(
            `http://localhost:3000/summaries/upload`,
            'test-file',
            '\n# Test',
        );
    });
});
