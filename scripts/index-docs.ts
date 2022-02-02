import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const POSTS_DIR = path.join(process.cwd(), 'posts');

const DELETE_LABEL = 'Delete took: ';
const INDEX_LABEL = 'Indexing took: ';

const indexDocs = async () => {
    console.time(DELETE_LABEL);

    const res = await supabase.from('note_contents').delete();

    if (res.status !== 200) {
        console.log(`Could not delete previous note contents.`);

        process.exit(1);
    }

    console.timeEnd(DELETE_LABEL);

    const notes = await fs.readdir(POSTS_DIR);

    console.time(INDEX_LABEL);

    for (const filename of notes) {
        const fileContents = await fs.readFile(
            `${POSTS_DIR}/${filename}`,
            'utf-8'
        );

        const { content, data } = await matter(fileContents);

        const parsedContents = content
            .split('\n')
            .filter(Boolean)
            // Remove some markdown syntax
            .map((line) => line.replace('-   ', ''));

        const values = parsedContents.map((line) => ({
            title: data.title,
            line,
        }));

        process.stdout.write(`Indexing contents of ${filename} ...`);

        await supabase.from('note_contents').insert(values);

        process.stdout.write(' [OK]\n');
    }

    console.log('Indexed all docs ...');

    console.timeEnd(INDEX_LABEL);
};

indexDocs();
