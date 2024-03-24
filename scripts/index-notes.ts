import 'dotenv/config';
import matter from 'gray-matter';
import fs from 'node:fs/promises';
import path from 'node:path';
import ora from 'ora';

import { turso } from '~lib/turso';
import type { NoteFrontmatter } from '~types/notes.types';

import { toISOString, updateEdgeConfig } from './helpers';
import { logger } from './logger';
import { seed } from './seed';

const NOTES_DIR = path.join(process.cwd(), 'src/content/notes');

const spinner = ora();

const indexDocs = async (): Promise<void> => {
    await seed();

    const notes = await fs.readdir(NOTES_DIR);

    const profiler = logger.startTimer();

    for (const filename of notes) {
        const fileContents = await fs.readFile(
            `${NOTES_DIR}/${filename}`,
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

        spinner.text = `Indexing contents of ${filename} ...`;
        spinner.start();

        const batchStatements = values.map((value) => ({
            sql: 'INSERT INTO notes (title, line, filename, created, updated) VALUES (?, ?, ?, ?, ?)',
            args: [
                value.title,
                value.line,
                value.filename,
                value.created,
                value.updated,
            ],
        }));

        const batchFtsStatements = values.map((value) => ({
            sql: 'INSERT INTO notes_fts (title, line, filename) VALUES (?, ?, ?)',
            args: [value.title, value.line, value.filename],
        }));

        await turso.batch(batchFtsStatements.concat(batchStatements), 'write');

        spinner.succeed(`Indexed contents of ${filename}`);
    }

    profiler.done({ message: 'Indexed all docs' });

    await updateEdgeConfig();
};

indexDocs().catch((e: unknown) => {
    spinner.fail('Failed to index docs');
    logger.error(e);
});
