import { parse } from '@formkit/tempo';
import type { AstroComponentFactory } from 'astro/dist/runtime/server';
import { getCollection, getEntry, render } from 'astro:content';
import flow from 'lodash/fp/flow';
import groupBy from 'lodash/fp/groupBy';
import mapValues from 'lodash/fp/mapValues';

import type { BlogArticleFrontmatter } from '~types/blog';
import type { Note, NoteFrontmatter } from '~types/notes';
import type { SummaryFrontmatter } from '~types/summaries';

import { searchNotes } from './notes-db';

type SearchNotesRpcResponse = {
    title: string;
    line: string;
}[];

type Lines = Record<string, string[]>;

const groupByTitle = flow(
    groupBy<SearchNotesRpcResponse[number]>(({ title }) => title),
    mapValues((notes) => notes.map(({ line }) => line)),
);

type Collection = 'blog' | 'notes' | 'summaries';

type AwaitedCollectionData = Awaited<
    ReturnType<typeof getCollection>
>[number]['data'];

export const getNotesByCollection = async (
    collection: Collection,
    orderBy: 'created' | 'updated',
): Promise<
    (AwaitedCollectionData & {
        filename: string;
    })[]
> => {
    const isProd = process.env.PROD === 'true';

    const entries = await getCollection(collection);

    return entries
        .filter((entry) => (isProd ? entry.data.published : true))
        .map((entry) => ({
            ...entry.data,
            filename: entry.id,
        }))
        .sort(
            (articleA, articleB) =>
                parse(articleB[orderBy], 'YYYY-MM-DD').getTime() -
                parse(articleA[orderBy], 'YYYY-MM-DD').getTime(),
        );
};

export const fetchNotes = async (
    query: string,
): Promise<{
    lines: Lines;
    notes: Note[];
}> => {
    const allNotes = (await getNotesByCollection('notes', 'updated')) ?? [];

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

export const getNoteData = async ({
    collection,
    slug,
}: {
    collection: Collection;
    slug: string;
}): Promise<{
    content: { Content: AstroComponentFactory };
    frontmatter: NoteFrontmatter | SummaryFrontmatter | BlogArticleFrontmatter;
} | null> => {
    const note = await getEntry(collection, slug);

    if (!note) {
        return null;
    }

    return {
        content: await render(note),
        frontmatter: note.data,
    };
};
