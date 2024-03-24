import { turso } from '~lib/turso';

export const seed = async (): Promise<void> => {
    await turso.executeMultiple(`
        DROP TABLE IF EXISTS notes;
        DROP TABLE IF EXISTS notes_fts;

        CREATE TABLE notes (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            line TEXT NOT NULL,
            filename TEXT NOT NULL,
            created TIMESTAMPTZ NOT NULL,
            updated TIMESTAMPTZ NOT NULL
        );

        CREATE VIRTUAL TABLE notes_fts USING fts5(
            title,
            line,
            filename,
            tokenize="trigram"
        );

        DROP TABLE IF EXISTS lesson_summaries;

        CREATE TABLE lesson_summaries (
            id SERIAL PRIMARY KEY,
            filename TEXT NOT NULL,
            title TEXT NOT NULL,
            created TIMESTAMPTZ NOT NULL,
            updated TIMESTAMPTZ NOT NULL
        );

        DROP INDEX lesson_summaries_filename_idx;
        DROP INDEX notes_filename_idx;
        
        CREATE INDEX lesson_summaries_filename_idx ON lesson_summaries(filename);
        CREATE INDEX notes_filename_idx ON notes(filename);
    `);
};
