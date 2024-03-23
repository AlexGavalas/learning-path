import { createClient } from '@vercel/edge-config';
import { getEntryBySlug } from 'astro:content';
import flow from 'lodash/fp/flow';
import groupBy from 'lodash/fp/groupBy';
import mapValues from 'lodash/fp/mapValues';

import { supabase } from '~lib/supabase';
import { turso } from '~lib/turso';
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
): Promise<{
    lines: Lines;
    notes: Readonly<PartialEdgeConfigNote[]>;
}> => {
    const data = await edgeConfig.get<PartialEdgeConfigNote[]>('meta');

    const allNotes = data ?? [];

    if (q.length > 0) {
        console.time('search_notes');
        await supabase.rpc('search_notes', { q });
        console.timeEnd('search_notes');

        console.time('turso');
        const { rows } = await turso.execute({
            sql: `SELECT * FROM notes WHERE line like '%' || ? || '%'`,
            args: [q.toLocaleLowerCase()],
        });
        console.timeEnd('turso');

        const lines = groupByTitle(rows);

        const noteTitles = new Set(rows.map(({ title }) => title));

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
