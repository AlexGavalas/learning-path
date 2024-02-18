import matter from 'gray-matter';
import fs from 'node:fs/promises';
import path from 'node:path';

import { db } from '~lib/sqlite';
import type { NoteFrontmatter } from '~types/notes.types';

import { toISOString } from './helpers';
import { logger } from './logger';

const setupTables = (): void => {
    db.exec('DROP TABLE IF EXISTS notes');

    db.exec(
        'CREATE VIRTUAL TABLE IF NOT EXISTS notes USING FTS5(title, line, filename, created, updated)',
    );
};

const seedContent = async (): Promise<void> => {
    const insertLine = db.prepare(
        'INSERT INTO notes (title, line, filename, created, updated) VALUES (@title, @line, @filename, @created, @updated)',
    );

    const notesPath = path.join(process.cwd(), 'src/content/notes');

    logger.info(`Reading notes directory (${notesPath}) ...`);

    const notes = await fs.readdir(notesPath);

    for (const filename of notes) {
        const fileContents = await fs.readFile(
            `${notesPath}/${filename}`,
            'utf-8',
        );

        const { content, data } = matter(fileContents) as unknown as {
            content: string;
            data: NoteFrontmatter;
        };

        if (data.published === false) {
            logger.debug(`Skipping ${filename} as it is not published yet ...`);

            continue;
        }

        const parsedContents = content
            .split('\n')
            .filter(Boolean)
            // Remove some markdown syntax
            .filter((line) => line !== '---' && !/^#+\s/.test(line))
            .map((line) => line.replace('-   ', ''));

        const fname = filename.replace(/\.mdx$/, '');
        const created = toISOString(data.created);
        const updated = toISOString(data.updated);

        const values = parsedContents.map((line) => ({
            title: data.title,
            line,
            filename: fname,
            created,
            updated,
        }));

        for (const value of values) {
            insertLine.run(value);
        }
    }
};

const main = async (): Promise<void> => {
    logger.info('Preparing SQLite database ...');

    setupTables();

    await seedContent();

    db.close();

    logger.info('SQLite database prepared successfully');
};

main().catch((e) => {
    logger.error('Failed to prepare SQLite database ...', e);
    process.exit(1);
});
