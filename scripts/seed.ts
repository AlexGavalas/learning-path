import { turso } from '~lib/turso';

export const seed = async (): Promise<void> => {
    await turso.executeMultiple(`
        DROP TABLE IF EXISTS notes_fts;

        CREATE VIRTUAL TABLE notes_fts USING fts5(
            title,
            line,
            filename,
            created,
            updated,
            tokenize="trigram"
        );

        DROP INDEX IF EXISTS notes_filename_idx;
        
        CREATE INDEX notes_filename_idx ON notes(filename);
    `);
};
