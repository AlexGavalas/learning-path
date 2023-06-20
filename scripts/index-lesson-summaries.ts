import axios from 'axios';
import 'dotenv/config';
import fs from 'fs/promises';
import matter from 'gray-matter';
import path from 'path';

import { supabase } from '~lib/supabase';

import { getEnvVariable, toISOString } from './helpers';

const SUMMARIES_DIR = path.join(process.cwd(), 'summaries');
const UPLOAD_URL = `${getEnvVariable(
    'PUBLIC_FILE_SERVER_URL',
)}/summaries/upload`;

const indexSummaries = async (): Promise<void> => {
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

        process.stdout.write(' [OK]\n');
    }
};

indexSummaries().catch((e) => {
    console.error(e);
});
