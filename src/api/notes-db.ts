import { turso } from '~lib/turso';
import type { NoteDBEntry } from '~types/notes';

export const searchNotes = async (query: string): Promise<NoteDBEntry[]> => {
    const { rows } = await turso.execute({
        args: [query],
        sql: `SELECT * FROM notes_fts WHERE line MATCH '"' || ? || '"'`,
    });

    return rows as unknown as NoteDBEntry[];
};
