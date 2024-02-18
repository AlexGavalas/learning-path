import { getEntryBySlug } from 'astro:content';
import flow from 'lodash/fp/flow';
import groupBy from 'lodash/fp/groupBy';
import mapValues from 'lodash/fp/mapValues';

import { db } from '~lib/sqlite';
import type {
    Note,
    NoteRenderResult,
    NotesCollection,
} from '~types/notes.types';

import { logger } from '../../scripts/logger';
import { fetchFileFromStorage } from './helpers';

type Lines = Record<string, string[]>;

const groupByTitle = flow(
    groupBy<Note>(({ title }) => title),
    mapValues((notes) => notes.map(({ line }) => line)),
);

export const fetchNotes = async (
    q: string,
): Promise<{ lines: Lines; notes: Note[] }> => {
    try {
        const allNotes = await db.$queryRaw<
            Note[]
        >`SELECT DISTINCT title, filename, created, updated FROM notes ORDER BY updated DESC, title ASC`;

        if (q.length > 0) {
            const params = {
                rawQuery: q,
                matchQuery: `"${q}"*`,
            };

            const data = await db.$queryRaw<
                Note[]
            >`SELECT * FROM notes WHERE line MATCH ${params.matchQuery} UNION SELECT * FROM notes WHERE line LIKE '%' || ${params.rawQuery} || '%'`;

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
    } catch (e) {
        logger.error(e);

        return {
            notes: [],
            lines: {},
        };
    }
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
    try {
        return await db.$queryRaw`SELECT * FROM notes WHERE filename = ${filename} LIMIT 1`;
    } catch (e) {
        logger.error(e);

        return null;
    }
};
