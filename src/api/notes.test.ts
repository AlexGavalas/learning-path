import { getEntryBySlug } from 'astro:content';

import { turso } from '~lib/turso';

import { getNoteData, getNoteMetadata } from './notes';

jest.mock<typeof import('@vercel/edge-config')>('@vercel/edge-config', () => ({
    ...jest.requireActual('@vercel/edge-config'),
    createClient: jest.fn().mockReturnValue({
        get: jest.fn().mockResolvedValue([{ filename: 'test' }]),
    }),
}));

jest.mock(
    'astro:content',
    () => ({
        getEntryBySlug: jest.fn().mockResolvedValue({
            body: 'test body',
            render: jest.fn().mockReturnValue({
                Content: jest.fn().mockReturnValue('<div>test body</div>'),
            }),
        }),
        getCollection: jest.fn().mockResolvedValue([{ slug: 'test' }]),
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
    it('calls getEntryBySlug', async () => {
        await getNoteData('test');

        expect(getEntryBySlug).toHaveBeenCalledTimes(1);
        expect(getEntryBySlug).toHaveBeenCalledWith('notes', 'test');
    });

    it('returns the body', async () => {
        const body = await getNoteData('test');

        expect(body).toStrictEqual(
            expect.objectContaining({ Content: expect.any(Function) }),
        );
    });
});

describe('getNoteMetadata', () => {
    const mockNoteMetadata = {
        length: 1,
        title: 'test data',
        created: '2024-01-01',
        updated: '2024-01-01',
        filename: 'test',
    };

    beforeAll(() => {
        jest.mocked(turso).execute.mockResolvedValue({
            columns: [],
            columnTypes: [],
            lastInsertRowid: undefined,
            rows: [mockNoteMetadata],
            rowsAffected: 0,
            toJSON: jest.fn(),
        });
    });

    it('returns the data', async () => {
        const data = await getNoteMetadata('test');

        expect(data).toBe(mockNoteMetadata);
    });
});
