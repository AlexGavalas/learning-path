import { getEntryBySlug } from 'astro:content';

import { supabase } from '~lib/supabase';

import { fetchFileFromStorage } from './helpers';
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

jest.mock('~lib/supabase');

jest.mock('./helpers');

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
    describe('when in production', () => {
        const previousValue = process.env.PROD;

        beforeAll(() => {
            process.env.PROD = 'true';
            process.env.PUBLIC_FILE_SERVER_ENABLED = 'true';

            jest.mocked(fetchFileFromStorage).mockResolvedValue('test body');
        });

        afterAll(() => {
            process.env.PROD = previousValue;
        });

        it('calls fetchFileFromStorage', async () => {
            await getNoteData('test');

            expect(fetchFileFromStorage).toHaveBeenCalledTimes(1);
            expect(fetchFileFromStorage).toHaveBeenCalledWith('notes/test.mdx');
        });

        it('returns the body', async () => {
            const body = await getNoteData('test');

            expect(body).toBe('test body');
        });

        it('does not call getEntryBySlug', async () => {
            await getNoteData('test');

            expect(getEntryBySlug).not.toHaveBeenCalled();
        });
    });

    describe('when in development', () => {
        const previousValue = process.env.PROD;

        beforeAll(() => {
            process.env.PROD = 'false';
        });

        afterAll(() => {
            process.env.PROD = previousValue;
        });

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

        it('does not call fetchFileFromStorage', async () => {
            await getNoteData('test');

            expect(fetchFileFromStorage).not.toHaveBeenCalled();
        });
    });
});

describe('getNoteMetadata', () => {
    beforeAll(() => {
        const { supabase: mockSupabase } =
            jest.requireMock<typeof import('~lib/__mocks__/supabase')>(
                '~lib/supabase',
            );

        mockSupabase.maybeSingle.mockReturnValue({
            data: 'test data',
            error: null,
        });
    });

    it('calls supabase.from', async () => {
        await getNoteMetadata('test');

        expect(supabase.from).toHaveBeenCalledTimes(1);
        expect(supabase.from).toHaveBeenCalledWith('notes');
    });

    it('returns the data', async () => {
        const data = await getNoteMetadata('test');

        expect(data).toBe('test data');
    });

    describe('when an error occurs', () => {
        beforeAll(() => {
            const { supabase: mockSupabase } =
                jest.requireMock<typeof import('~lib/__mocks__/supabase')>(
                    '~lib/supabase',
                );

            mockSupabase.maybeSingle.mockReturnValue({
                data: null,
                error: 'error',
            });
        });

        it('returns null', async () => {
            const data = await getNoteMetadata('test');

            expect(data).toBeNull();
        });
    });
});
