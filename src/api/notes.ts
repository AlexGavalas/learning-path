import { getEntryBySlug } from 'astro:content';
import flow from 'lodash/fp/flow';
import groupBy from 'lodash/fp/groupBy';
import mapValues from 'lodash/fp/mapValues';

import { edgeConfig } from '~lib/edge-config';
import { turso } from '~lib/turso';
import type {
    NoteRenderResult,
    NotesCollection,
    PartialEdgeConfigNote,
} from '~types/notes.types';

type SearchNotesRpcResponse = {
    title: string;
    line: string;
}[];

type Lines = Record<string, string[]>;

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
        const { rows } = await turso.execute({
            sql: `SELECT * FROM notes_fts WHERE line match '"' || ? || '"'`,
            args: [q],
        });

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
    const note = await getEntryBySlug('notes', filename);

    return (await note?.render()) ?? '';
};

export const getNoteMetadata = async (
    filename: string,
): Promise<NotesCollection['data'] | null> => {
    console.time('edgeConfig');
    const data = await edgeConfig.get<PartialEdgeConfigNote[]>('meta');
    const note = data?.find((note) => note.filename === filename);
    console.timeEnd('edgeConfig');

    console.time('turso');
    const { rows } = await turso.execute({
        sql: 'SELECT * FROM notes WHERE filename = ? ORDER BY updated DESC, rowid DESC LIMIT 1',
        args: [filename],
    });
    console.timeEnd('turso');

    return note as NotesCollection['data'];
    return (rows[0] ?? null) as unknown as NotesCollection['data'];
};
