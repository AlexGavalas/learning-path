import 'dotenv/config';
import matter from 'gray-matter';
import fs from 'node:fs/promises';
import path from 'node:path';
import ora from 'ora';

import { supabase } from '~lib/supabase';
import { type LessonSummaryFrontmatter } from '~types/lesson-summaries.types';

import { getEnvVariable, readFile, toISOString, uploadFile } from './helpers';
import { logger } from './logger';

export const indexLessonSummaries = async (): Promise<void> => {
    const spinner = ora({
        isSilent: process.env.NODE_ENV === 'test',
    });

    const SUMMARIES_DIR = path.join(
        process.cwd(),
        'src/content/lesson-summaries',
    );

    const summaries = await fs.readdir(SUMMARIES_DIR);

    for (const filename of summaries) {
        spinner.text = `Uploading contents of ${filename} ...`;
        spinner.start();

        const fileContents = await readFile(`${SUMMARIES_DIR}/${filename}`);

        const { content, data: frontmatter } = matter(
            fileContents,
        ) as unknown as {
            content: string;
            data: LessonSummaryFrontmatter;
        };

        if (frontmatter.published === false) {
            logger.debug(`Skipping ${filename} as it is not published yet ...`);

            continue;
        }

        const { error } = await supabase.from('lesson_summaries_meta').upsert({
            filename: filename.replace(/\.mdx$/, ''),
            title: frontmatter.title,
            created: toISOString(frontmatter.created),
            updated: toISOString(frontmatter.updated),
        });

        if (error !== null) {
            logger.error(error);
        }

        const UPLOAD_URL = `${getEnvVariable(
            'PUBLIC_FILE_SERVER_URL',
        )}/summaries/upload`;

        // Content is uploaded without the frontmatter
        await uploadFile({ content, filename, url: UPLOAD_URL });

        spinner.succeed(`Uploaded contents of ${filename}`);
    }
};
