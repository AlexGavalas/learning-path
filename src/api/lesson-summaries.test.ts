import { getEntryBySlug } from 'astro:content';

import { supabase } from '~lib/supabase';

import { fetchFileFromStorage } from './helpers';
import { getLessonSummaries, getLessonSummaryData } from './lesson-summaries';

jest.mock(
    'astro:content',
    () => ({
        getEntryBySlug: jest.fn().mockResolvedValue({
            body: 'test body',
            render: jest.fn().mockReturnValue({
                Content: jest.fn().mockReturnValue('<div>test body</div>'),
            }),
        }),
    }),
    {
        virtual: true,
    },
);

jest.mock('~lib/supabase');

jest.mock('./helpers');

describe('getLessonSummaries', () => {
    it('calls supabase', async () => {
        await getLessonSummaries();

        expect(supabase.from).toHaveBeenCalledTimes(1);
        expect(supabase.from).toHaveBeenCalledWith('lesson_summaries_meta');
    });
});

describe('getLessonSummaryData', () => {
    describe('when in development', () => {
        beforeAll(() => {
            process.env.PROD = 'false';
        });

        it('calls getEntryBySlug', async () => {
            await getLessonSummaryData('test');

            expect(getEntryBySlug).toHaveBeenCalledTimes(1);
            expect(getEntryBySlug).toHaveBeenCalledWith(
                'lesson-summaries',
                'test',
            );
        });

        it('returns the body', async () => {
            const body = await getLessonSummaryData('test');

            expect(body).toEqual(
                expect.objectContaining({ Content: expect.any(Function) }),
            );
        });

        it('does not call fetchFileFromStorage', async () => {
            await getLessonSummaryData('test');

            expect(fetchFileFromStorage).not.toHaveBeenCalled();
        });
    });

    describe('when in production', () => {
        beforeAll(() => {
            process.env.PROD = 'true';
            process.env.PUBLIC_FILE_SERVER_ENABLED = 'true';

            jest.mocked(fetchFileFromStorage).mockResolvedValue('test body');
        });

        it('calls fetchFileFromStorage', async () => {
            await getLessonSummaryData('test');

            expect(fetchFileFromStorage).toHaveBeenCalledTimes(1);
            expect(fetchFileFromStorage).toHaveBeenCalledWith(
                'summaries/test.mdx',
            );
        });

        it('returns the body', async () => {
            const body = await getLessonSummaryData('test');

            expect(body).toBe('test body');
        });

        it('does not call getEntryBySlug', async () => {
            await getLessonSummaryData('test');

            expect(getEntryBySlug).not.toHaveBeenCalled();
        });
    });
});
