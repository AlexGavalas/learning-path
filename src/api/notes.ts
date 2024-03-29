import { getEntryBySlug } from 'astro:content';
import flow from 'lodash/fp/flow';
import groupBy from 'lodash/fp/groupBy';
import mapValues from 'lodash/fp/mapValues';

import type {
    Note,
    NoteFrontmatter,
    NoteRenderResult,
} from '~types/notes.types';

import { getNoteMetadata, searchNotes } from './notes-db';

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
