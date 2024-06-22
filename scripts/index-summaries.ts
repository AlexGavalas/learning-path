import type { InStatement } from '@libsql/client';
import 'dotenv/config';
import matter from 'gray-matter';
import fs from 'node:fs/promises';
import path from 'node:path';
import ora from 'ora';

import { turso } from '~lib/turso';
import { type SummaryFrontmatter } from '~types/summaries.types';

import { readFile, toISOString } from './helpers';
import { logger } from './logger';

export const indexSummaries = async (): Promise<void> => {
    const spinner = ora({
        isSilent: process.env.NODE_ENV === 'test',
    });

    await turso.execute('DELETE FROM summaries');

    const SUMMARIES_DIR = path.join(process.cwd(), 'src/content/summaries');

    const summaries = await fs.readdir(SUMMARIES_DIR);

    const batchOperations: InStatement[] = [];

    for (const filename of summaries) {
        spinner.text = `Reading contents of ${filename} ...`;
        spinner.start();

        const fileContents = await readFile(`${SUMMARIES_DIR}/${filename}`);

        const { data: frontmatter } = matter(fileContents) as unknown as {
            content: string;
            data: SummaryFrontmatter;
        };

        if (frontmatter.published === false) {
            spinner.stop();
            logger.debug(`Skipping ${filename} as it is not published yet ...`);

            continue;
        }

        batchOperations.push({
            args: [
                filename.replace(/\.mdx$/u, ''),
                frontmatter.title,
                toISOString(frontmatter.created),
                toISOString(frontmatter.updated),
            ],
            sql: 'INSERT INTO summaries (filename, title, created, updated) VALUES (?, ?, ?, ?)',
        });

        spinner.succeed();
    }

    spinner.text = 'Indexing summaries ...';
    spinner.start();

    await turso.batch(batchOperations, 'write');

    spinner.succeed();
};
