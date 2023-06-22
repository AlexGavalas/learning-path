import 'dotenv/config';
import fs from 'fs/promises';
import matter from 'gray-matter';
import path from 'path';

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

        const { content, data: frontmatter } = matter(fileContents);

        const { error } = await supabase.from('lesson_summaries_meta').upsert({
            filename: filename.replace(/\.md?$/, ''),
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
        await uploadFile(UPLOAD_URL, content, filename);

        process.stdout.write(' [OK]\n');
    }
};
