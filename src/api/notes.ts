import { createClient } from '@vercel/edge-config';
import { getCollection, getEntryBySlug } from 'astro:content';
import flow from 'lodash/fp/flow';
import groupBy from 'lodash/fp/groupBy';
import mapValues from 'lodash/fp/mapValues';

import { supabase } from '~lib/supabase';
import type { Database } from '~types/database.types';
import type {
    NoteRenderResult,
    NotesCollection,
    PartialEdgeConfigNote,
} from '~types/notes.types';

import { fetchFileFromStorage } from './helpers';

type SearchNotesRpcResponse =
    Database['public']['Functions']['search_notes']['Returns'];

type Lines = Record<string, string[]>;

const edgeConfig = createClient(process.env.PUBLIC_EDGE_CONFIG);

const groupByTitle = flow(
    groupBy<SearchNotesRpcResponse[number]>(({ title }) => title),
    mapValues((notes) => notes.map(({ line }) => line)),
);

export const fetchNotes = async (
    q: string,
): Promise<{ lines: Lines; notes: PartialEdgeConfigNote[] }> => {
    const data = await edgeConfig.get<PartialEdgeConfigNote[]>('meta');

    const allNotes = data ?? [];

    if (q.length > 0) {
        const { data, error } = await supabase.rpc('search_notes', { q });

        if (error !== null) {
            return {
                notes: [],
                lines: {},
            };
        }

        const lines = groupByTitle(data);

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
    const data = await edgeConfig.get<PartialEdgeConfigNote[]>('meta');

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

export const getNoteData = async (
    filename: string,
): Promise<string | NoteRenderResult> => {
    const isProd = process.env.PROD === 'true';
    const isPublicFileServerEnabled =
        process.env.PUBLIC_FILE_SERVER_ENABLED === 'true';

    if (isProd && isPublicFileServerEnabled) {
        const filePath = `${filename}.mdx`;

        return await fetchFileFromStorage(`notes/${filePath}`);
    }

    const note = await getEntryBySlug('notes', filename);

    return (await note?.render()) ?? '';
};

export const getNoteMetadata = async (
    filename: string,
): Promise<NotesCollection['data'] | null> => {
    const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('updated', { ascending: false })
        .eq('filename', filename)
        .limit(1)
        .maybeSingle();

    if (error !== null) {
        return null;
    }

    return data;
};
