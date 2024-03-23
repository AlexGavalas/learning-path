import { turso } from '~lib/turso';

export const seed = async (): Promise<void> => {
    await turso.executeMultiple(`
        DROP TABLE IF EXISTS notes;

        CREATE TABLE notes (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            line TEXT NOT NULL,
            filename TEXT NOT NULL,
            created TIMESTAMPTZ NOT NULL,
            updated TIMESTAMPTZ NOT NULL
        );
    `);
};
