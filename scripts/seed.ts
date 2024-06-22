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

        DROP TABLE IF EXISTS summaries;

        CREATE TABLE summaries (
            id SERIAL PRIMARY KEY,
            filename TEXT NOT NULL,
            title TEXT NOT NULL,
            created TIMESTAMPTZ NOT NULL,
            updated TIMESTAMPTZ NOT NULL
        );

        DROP INDEX IF EXISTS summaries_filename_idx;
        DROP INDEX IF EXISTS notes_filename_idx;
        
        CREATE INDEX summaries_filename_idx ON summaries(filename);
        CREATE INDEX notes_filename_idx ON notes(filename);
    `);
};
