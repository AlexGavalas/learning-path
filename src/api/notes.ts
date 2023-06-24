import { createClient } from '@vercel/edge-config';
import { getCollection, getEntryBySlug } from 'astro:content';

import { supabase } from '~lib/supabase';
import type { Note, NotesCollection } from '~types/notes.types';

import { fetchFileFromStorage } from './helpers';

type Lines = Record<string, string[]>;

const edgeConfig = createClient(process.env.PUBLIC_EDGE_CONFIG);

export const fetchNotes = async (
    q: string,
): Promise<{ lines: Lines; notes: Note[] }> => {
    const data = await edgeConfig.get<Note[]>('meta');

    const allNotes = data ?? [];

    if (q.length > 0) {
        const { data, error } = await supabase.rpc('search_notes', { q });

        if (error !== null) {
            return {
                notes: [],
                lines: {},
            };
        }

        const lines = data.reduce<Lines>((acc, { title, line }) => {
            acc[title] = (acc[title] ?? []).concat(line);
            return acc;
        }, {});

        const noteTitles = new Set(data.map(({ title }) => title));

        const filteredNotes = allNotes.filter(({ title }) =>
            noteTitles.has(title),
        );

        return {
            notes: filteredNotes,
            lines,
        };
    }

    return {
        notes: allNotes,
        lines: {},
    };
};

type NoteSlugs = { slug: string }[];

const getSlugsFromStorage = async (): Promise<NoteSlugs | null> => {
    const data = await edgeConfig.get<Note[]>('meta');

    if (data === undefined) {
        return null;
    }

    return data.map((file) => ({
        slug: file.filename,
    }));
};

export const getAllNoteIds = async (): Promise<{ slug: string }[] | null> => {
    const isProd = process.env.PROD === 'true';

    if (isProd) {
        return await getSlugsFromStorage();
    }

    return await getCollection('notes');
};

export const getNoteData = async (filename: string): Promise<string> => {
    const isProd = process.env.PROD === 'true';

    if (isProd) {
        const filePath = `${filename}.mdx`;

        return await fetchFileFromStorage(`notes/${filePath}`);
    }

    const note = await getEntryBySlug('notes', filename);

    return note?.body ?? '';
};

export const getNoteMetadata = async (
    filename: string,
): Promise<NotesCollection['data'] | null> => {
    const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('filename', filename)
        .limit(1)
        .maybeSingle();

    if (error !== null) {
        return null;
    }

    return data;
};
