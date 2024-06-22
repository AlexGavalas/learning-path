import { getEntryBySlug } from 'astro:content';

import { getSummaryData } from './summaries';

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

describe('getSummaryData', () => {
    it('calls getEntryBySlug', async () => {
        await getSummaryData('test');

        expect(getEntryBySlug).toHaveBeenCalledTimes(1);
        expect(getEntryBySlug).toHaveBeenCalledWith('summaries', 'test');
    });

    it('returns the body', async () => {
        const body = await getSummaryData('test');

        expect(body).toStrictEqual(
            expect.objectContaining({
                content: {
                    Content: expect.any(Function),
                },
            }),
        );
    });
});
