import { turso } from '~lib/turso';
import type { Note } from '~types/notes';

export const searchNotes = async (query: string): Promise<Note[]> => {
    const { rows } = await turso.execute({
        args: [query],
        sql: `SELECT * FROM notes_fts WHERE line MATCH '"' || ? || '"'`,
    });

    return rows as unknown as Note[];
};
