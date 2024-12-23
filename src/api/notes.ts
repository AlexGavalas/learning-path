import type { AstroComponentFactory } from 'astro/dist/runtime/server';
import { getEntry, render } from 'astro:content';
import flow from 'lodash/fp/flow';
import groupBy from 'lodash/fp/groupBy';
import mapValues from 'lodash/fp/mapValues';

import type { Note, NoteFrontmatter } from '~types/notes';

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
    query: string,
): Promise<{
    lines: Lines;
    notes: Note[];
}> => {
    const allNotes = await getNoteMetadata();

    if (query.length > 0) {
        const rows = await searchNotes(query);

        const lines = groupByTitle(rows);

        const noteTitles = new Set(rows.map(({ title }) => title));

        const filteredNotes = allNotes.filter(({ title }) =>
            noteTitles.has(title),
        );

        return {
            lines,
            notes: filteredNotes,
        };
    }

    return {
        lines: {},
        notes: allNotes,
    };
};

export const getNoteData = async (
    filename: string,
): Promise<{
    content: { Content: AstroComponentFactory };
    frontmatter: NoteFrontmatter;
} | null> => {
    const note = await getEntry('notes', filename);

    if (!note) {
        return null;
    }

    return {
        content: await render(note),
        frontmatter: note.data,
    };
};
