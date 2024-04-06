import { edgeConfig } from '~lib/edge-config';
import { turso } from '~lib/turso';
import { type Note } from '~types/notes.types';

export const searchNotes = async (query: string): Promise<Note[]> => {
    const { rows } = await turso.execute({
        args: [query],
        sql: `SELECT * FROM notes_fts WHERE line MATCH '"' || ? || '"'`,
    });

    return rows as unknown as Note[];
};

export const getAllNotes = async (): Promise<Note[]> => {
    const { rows } = await turso.execute(
        'SELECT DISTINCT(title), filename, created, updated FROM notes_fts ORDER BY updated DESC, title ASC',
    );

    return rows as unknown as Note[];
};

export const getNoteMetadata = (): Promise<Note[]> =>
    (edgeConfig.get<Note[]>('meta') ?? []) as Promise<Note[]>;
