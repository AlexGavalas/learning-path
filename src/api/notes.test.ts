import { getEntry } from 'astro:content';

import { getNoteData } from './notes';

vi.mock('astro:content', () => ({
    getCollection: vi.fn().mockResolvedValue([{ slug: 'test' }]),
    getEntry: vi.fn().mockResolvedValue({
        body: 'test body',
    }),
    render: vi.fn().mockReturnValue({
        Content: vi.fn().mockReturnValue('<div>test body</div>'),
    }),
}));

vi.mock('~lib/turso');

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
