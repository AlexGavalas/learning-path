import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import fs from 'fs/promises';
import matter from 'gray-matter';
import path from 'path';

import { type Database } from '~types/database.types';

import { toISOString } from './helpers';

const SUMMARIES_DIR = path.join(process.cwd(), 'summaries');
const UPLOAD_URL = `${process.env.FILE_SERVER_URL}/summaries/upload`;

const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

const indexSummaries = async () => {
    const summaries = await fs.readdir(SUMMARIES_DIR);

    for (const filename of summaries) {
        process.stdout.write(`Uploading contents of ${filename} ...`);

        const fileContents = await fs.readFile(
            `${SUMMARIES_DIR}/${filename}`,
            'utf-8',
        );

        const { content, data: frontmatter } = matter(fileContents);

        await supabase.from('lesson_summaries_meta').upsert({
            filename: filename.replace(/\.md?$/, ''),
            title: frontmatter.title,
            created: toISOString(frontmatter.created),
            updated: toISOString(frontmatter.updated),
        });

        try {
            const form = new FormData();
            form.append('md_file', new Blob([content]), filename);

            await axios.postForm(UPLOAD_URL, form);
        } catch (e) {
            console.error(e);
        }

        // Keep the old storage for now
        await supabase.storage
            .from('summaries_md_files')
            .upload(filename, content, {
                contentType: 'text/markdown',
                upsert: true,
            });

        process.stdout.write(' [OK]\n');
    }

    const url = new URL(
        'https://learning-path.dev/lessons-summary/api/revalidate',
    );

    url.searchParams.set('secret', process.env.REVALIDATE_SECRET);
    url.searchParams.set('path', '/lessons-summary');

    const response = await fetch(url);

    if (response.ok) {
        const data = await response.json();

        console.log('Revalidation successful', data);
    } else {
        console.error('Revalidation failed', response);
    }
};

indexSummaries().catch((e) => {
    console.error(e);
});
