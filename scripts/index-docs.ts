import { createClient } from '@supabase/supabase-js';
import { parse } from 'date-fns';
import fs from 'fs/promises';
import matter from 'gray-matter';
import path from 'path';

import { type Database } from '../types/database.types';

const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

const NOTES_DIR = path.join(process.cwd(), 'notes');

const DELETE_LABEL = 'Delete took: ';
const INDEX_LABEL = 'Indexing took: ';

const toISOString = (date: string) =>
    parse(date, 'yyyy-MM-dd', new Date()).toISOString();

const indexDocs = async () => {
    console.time(DELETE_LABEL);

    // Delete all records where the title is not empty, meaning all records
    const res = await supabase.from('notes').delete().neq('title', '');

    if (res.error) {
        console.error('Could not delete previous notes.');
        console.error(res.error);

        process.exit(1);
    }

    console.timeEnd(DELETE_LABEL);

    const notes = await fs.readdir(NOTES_DIR);

    console.time(INDEX_LABEL);

    for (const filename of notes) {
        const fileContents = await fs.readFile(
            `${NOTES_DIR}/${filename}`,
            'utf-8',
        );

        const { content, data } = matter(fileContents);

        const parsedContents = content
            .split('\n')
            .filter(Boolean)
            // Remove some markdown syntax
            .filter((line) => line !== '---')
            .map((line) => line.replace('-   ', ''));

        const values = parsedContents.map((line) => ({
            title: data.title,
            line,
            filename: filename.replace(/\.mdx?$/, ''),
            created: toISOString(data.date),
            updated: toISOString(data.updated),
        }));

        process.stdout.write(`Indexing contents of ${filename} ...`);

        await supabase.from('notes').upsert(values);

        process.stdout.write(' [OK]\n');
    }

    console.log('Indexed all docs ...');

    console.timeEnd(INDEX_LABEL);
};

indexDocs();
