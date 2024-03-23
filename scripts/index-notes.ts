import 'dotenv/config';
import matter from 'gray-matter';
import fs from 'node:fs/promises';
import path from 'node:path';
import ora from 'ora';

// import { supabase } from '~lib/supabase';
import { turso } from '~lib/turso';
import type { NoteFrontmatter } from '~types/notes.types';

import {
    // getEnvVariable,
    toISOString,
    updateEdgeConfig, // uploadFile,
} from './helpers';
import { logger } from './logger';
import { seed } from './seed';

const NOTES_DIR = path.join(process.cwd(), 'src/content/notes');

const DELETE_LABEL = 'Delete took: ';
const INDEX_LABEL = 'Indexing took: ';

const spinner = ora();

const dropNotesTable = async (): Promise<void> => {
    const profiler = logger.startTimer();

    // Delete all records where the title is not empty, meaning all records
    // const { error } = await supabase.from('notes').delete().neq('title', '');
    await turso.execute('DELETE FROM notes WHERE title IS NOT NULL');

    // if (error !== null) {
    //     logger.error('Could not delete previous notes.', error);
    //     process.exit(1);
    // }

    profiler.done({ message: DELETE_LABEL });
};

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

        spinner.text = `Writing file ${filename} in storage ...`;
        spinner.start();

        // const UPLOAD_URL = `${getEnvVariable(
        //     'PUBLIC_FILE_SERVER_URL',
        // )}/notes/upload`;

        // await uploadFile({ content, filename, url: UPLOAD_URL });

        spinner.succeed(`Wrote file ${filename} in storage`);

        spinner.text = `Indexing contents of ${filename} ...`;
        spinner.start();

        // await supabase.from('notes').upsert(values);
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

        await turso.batch(batchStatements, 'write');

        const batchFtsStatements = values.map((value) => ({
            sql: 'INSERT INTO notes_fts (title, line, filename) VALUES (?, ?, ?)',
            args: [value.title, value.line, value.filename],
        }));

        await turso.batch(batchFtsStatements, 'write');

        spinner.succeed(`Indexed contents of ${filename}`);
    }

    logger.info('Indexed all docs ...');

    profiler.done({ message: INDEX_LABEL });

    await updateEdgeConfig();
};

indexDocs().catch((e: unknown) => {
    spinner.fail('Failed to index docs');
    logger.error(e);
});
