import { edgeConfig } from '~lib/edge-config';
import { turso } from '~lib/turso';
import { type Note } from '~types/notes.types';

export const searchNotes = async (q: string): Promise<Note[]> => {
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

export const getNoteMetadata = async (): Promise<Note[]> => {
    return ((await edgeConfig.get<Note[]>('meta')) ?? []) as Note[];
};
