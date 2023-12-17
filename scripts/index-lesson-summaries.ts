import 'dotenv/config';
import matter from 'gray-matter';
import fs from 'node:fs/promises';
import path from 'node:path';

import { supabase } from '~lib/supabase';

import { getEnvVariable, readFile, toISOString, uploadFile } from './helpers';

export const indexLessonSummaries = async (): Promise<void> => {
    const SUMMARIES_DIR = path.join(
        process.cwd(),
        'src/content/lesson-summaries',
    );

    const summaries = await fs.readdir(SUMMARIES_DIR);

    for (const filename of summaries) {
        process.stdout.write(`Uploading contents of ${filename} ...`);

        const fileContents = await readFile(`${SUMMARIES_DIR}/${filename}`);

        const { content, data: frontmatter } = matter(
            fileContents,
        ) as unknown as {
            content: string;
            data: { title: string; created: string; updated: string };
        };

        const { error } = await supabase.from('lesson_summaries_meta').upsert({
            filename: filename.replace(/\.mdx$/, ''),
            title: frontmatter.title,
            created: toISOString(frontmatter.created),
            updated: toISOString(frontmatter.updated),
        });

        if (error !== null) {
            console.error(error);
        }

        const UPLOAD_URL = `${getEnvVariable(
            'PUBLIC_FILE_SERVER_URL',
        )}/summaries/upload`;

        // Content is uploaded without the frontmatter
        await uploadFile({ content, filename, url: UPLOAD_URL });

        process.stdout.write(' [OK]\n');
    }
};
