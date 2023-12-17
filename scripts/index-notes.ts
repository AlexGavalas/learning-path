import 'dotenv/config';
import matter from 'gray-matter';
import fs from 'node:fs/promises';
import path from 'node:path';

import { supabase } from '~lib/supabase';
import type { NoteFrontmatter } from '~types/notes.types';

import {
    getEnvVariable,
    toISOString,
    updateEdgeConfig,
    uploadFile,
} from './helpers';

const NOTES_DIR = path.join(process.cwd(), 'src/content/notes');

const DELETE_LABEL = 'Delete took: ';
const INDEX_LABEL = 'Indexing took: ';

const dropNotesTable = async (): Promise<void> => {
    console.time(DELETE_LABEL);

    // Delete all records where the title is not empty, meaning all records
    const { error } = await supabase.from('notes').delete().neq('title', '');

    if (error !== null) {
        console.error('Could not delete previous notes.');
        console.error(error);

        process.exit(1);
    }

    console.timeEnd(DELETE_LABEL);
};

const indexDocs = async (): Promise<void> => {
    await dropNotesTable();

    const notes = await fs.readdir(NOTES_DIR);

    console.time(INDEX_LABEL);

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
            console.log(`Skipping ${filename} as it is not published yet ...`);

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

        process.stdout.write(`Writing file ${filename} in storage ...`);

        const UPLOAD_URL = `${getEnvVariable(
            'PUBLIC_FILE_SERVER_URL',
        )}/notes/upload`;

        await uploadFile({ content, filename, url: UPLOAD_URL });

        process.stdout.write(' [OK]\n');

        process.stdout.write(`Indexing contents of ${filename} ...`);

        await supabase.from('notes').upsert(values);

        process.stdout.write(' [OK]\n');
    }

    console.log('Indexed all docs ...');

    console.timeEnd(INDEX_LABEL);

    await updateEdgeConfig();
};

indexDocs().catch((e) => {
    console.error(e);
});
