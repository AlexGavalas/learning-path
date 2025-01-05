import { getEntry } from 'astro:content';

import { getNoteData } from './notes';

jest.mock(
    'astro:content',
    () => ({
        getCollection: jest.fn().mockResolvedValue([{ slug: 'test' }]),
        getEntry: jest.fn().mockResolvedValue({
            body: 'test body',
        }),
        render: jest.fn().mockReturnValue({
            Content: jest.fn().mockReturnValue('<div>test body</div>'),
        }),
    }),
    {
        virtual: true,
    },
);

jest.mock('~lib/turso');

describe('getNoteData', () => {
    it('calls getEntry', async () => {
        await getNoteData({ collection: 'notes', slug: 'test' });

        expect(getEntry).toHaveBeenCalledTimes(1);
        expect(getEntry).toHaveBeenCalledWith('notes', 'test');
    });

    it('returns the body', async () => {
        const body = await getNoteData({ collection: 'notes', slug: 'test' });

        expect(body).toStrictEqual({
            content: expect.objectContaining({ Content: expect.any(Function) }),
            frontmatter: undefined,
        });
    });
});
