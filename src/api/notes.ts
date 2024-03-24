import { getEntryBySlug } from 'astro:content';
import flow from 'lodash/fp/flow';
import groupBy from 'lodash/fp/groupBy';
import mapValues from 'lodash/fp/mapValues';

import { edgeConfig } from '~lib/edge-config';
import { turso } from '~lib/turso';
import type {
    Note,
    NoteFrontmatter,
    NoteRenderResult,
} from '~types/notes.types';

type SearchNotesRpcResponse = {
    title: string;
    line: string;
}[];

type Lines = Record<string, string[]>;

const searchNotes = async (q: string): Promise<Note[]> => {
    const { rows } = await turso.execute({
        sql: `SELECT * FROM notes_fts WHERE line match '"' || ? || '"'`,
        args: [q],
    });

    return rows as unknown as Note[];
};

export const getAllNotes = async (): Promise<Note[]> => {
    const { rows } = await turso.execute(
        'SELECT DISTINCT(title), filename, created, updated FROM notes ORDER BY updated DESC, title ASC',
    );

    return rows as unknown as Note[];
};

const getNoteMetadata = async (): Promise<Note[]> => {
    return ((await edgeConfig.get<Note[]>('meta')) ?? []) as Note[];
};

const groupByTitle = flow(
    groupBy<SearchNotesRpcResponse[number]>(({ title }) => title),
    mapValues((notes) => notes.map(({ line }) => line)),
);

export const fetchNotes = async (
    q: string,
): Promise<{
    lines: Lines;
    notes: Readonly<Note[]>;
}> => {
    const allNotes = await getNoteMetadata();

    if (q.length > 0) {
        const rows = await searchNotes(q);

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
): Promise<{
    content: NoteRenderResult;
    frontmatter: NoteFrontmatter;
} | null> => {
    const note = await getEntryBySlug('notes', filename);

    if (note === undefined) {
        return null;
    }

    return {
        content: await note.render(),
        frontmatter: note.data,
    };
};
