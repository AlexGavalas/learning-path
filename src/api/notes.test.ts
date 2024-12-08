import { getEntry } from 'astro:content';

import { getNoteData } from './notes';

jest.mock<typeof import('@vercel/edge-config')>('@vercel/edge-config', () => ({
    ...jest.requireActual('@vercel/edge-config'),
    createClient: jest.fn().mockReturnValue({
        get: jest.fn().mockResolvedValue([
            {
                created: '2024-01-01',
                filename: 'test',
                title: 'test data',
                updated: '2024-01-01',
            },
        ]),
    }),
}));

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

describe('fetchNotes', () => {
    it.todo('calls edgeConfig.get');

    describe('when there is a query', () => {
        describe('when there is no error', () => {
            it.todo('returns the notes and lines');
        });

        describe('when there is an error', () => {
            it.todo('returns an empty array of notes and lines');
        });
    });
    describe('when there is no query', () => {
        it.todo('returns all notes and an empty object of lines');
    });
});

describe('getNoteData', () => {
    it('calls getEntry', async () => {
        await getNoteData('test');

        expect(getEntry).toHaveBeenCalledTimes(1);
        expect(getEntry).toHaveBeenCalledWith('notes', 'test');
    });

    it('returns the body', async () => {
        const body = await getNoteData('test');

        expect(body).toStrictEqual({
            content: expect.objectContaining({ Content: expect.any(Function) }),
            frontmatter: undefined,
        });
    });
});
