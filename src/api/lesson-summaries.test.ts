import { getEntryBySlug } from 'astro:content';

import { getLessonSummaryData } from './lesson-summaries';

jest.mock(
    'astro:content',
    () => ({
        getCollection: jest.fn().mockResolvedValue([]),
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

jest.mock('~lib/turso');

describe('getLessonSummaryData', () => {
    it('calls getEntryBySlug', async () => {
        await getLessonSummaryData('test');

        expect(getEntryBySlug).toHaveBeenCalledTimes(1);
        expect(getEntryBySlug).toHaveBeenCalledWith('lesson-summaries', 'test');
    });

    it('returns the body', async () => {
        const body = await getLessonSummaryData('test');

        expect(body).toStrictEqual(
            expect.objectContaining({
                content: {
                    Content: expect.any(Function),
                },
            }),
        );
    });
});
