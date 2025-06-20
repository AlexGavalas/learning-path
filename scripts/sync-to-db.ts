import 'dotenv/config';
import matter from 'gray-matter';
import fs from 'node:fs/promises';
import ora from 'ora';
import { simpleGit } from 'simple-git';

import { turso } from '~lib/turso';
import type { NoteFrontmatter } from '~types/notes';

import { formatMarkdownLine, toISOString } from './helpers';
import { logger } from './logger';

const spinner = ora({
    isEnabled: !process.env.IS_LEFTHOOK,
});

const main = async (): Promise<void> => {
    const git = simpleGit();

    const diffSummary = await git.diffSummary([
        'HEAD~',
        'HEAD',
        'src/content/notes',
    ]);

    for (const file of diffSummary.files) {
        const fileContents = await fs.readFile(file.file, 'utf-8');

        const { data } = matter(fileContents) as unknown as {
            content: string;
            data: NoteFrontmatter;
        };

        if (data.published === false) {
            logger.debug(
                `Skipping ${file.file} as it is not published yet ...`,
            );

            continue;
        }

        const diff = await git.diff([
            'HEAD~',
            'HEAD',
            '--unified=0',
            '--no-ext-diff',
            file.file,
        ]);

        const lines = diff
            .split('\n')
            .filter(
                (line) =>
                    !/^[+-]title:\s/u.test(line) &&
                    !/^[+-]created:\s/u.test(line) &&
                    !/^[+-]updated:\s/u.test(line) &&
                    !/^[+-]published:\s/u.test(line),
            )
            .filter(
                (line) =>
                    !line.startsWith('+++') &&
                    !line.startsWith('---') &&
                    !/^[+-]\s*#+\s/u.test(line) &&
                    /^[+-]{1}/u.test(line),
            );

        const additions = lines.filter(
            (line) => line !== '+' && line.startsWith('+'),
        );

        const deletions = lines.filter(
            (line) => line !== '-' && line.startsWith('-'),
        );

        const fname = file.file.match(/(?<fname>[^/]*)\.mdx$/u)?.[1] ?? '';
        const created = toISOString(data.created);
        const updated = toISOString(data.updated);

        if (deletions.length > 0) {
            spinner.text = `Deleting old entries of ${file.file} ...`;
            spinner.start();

            for (const line of deletions) {
                await turso.execute({
                    args: [formatMarkdownLine(line)],
                    sql: `DELETE FROM notes_fts WHERE line MATCH '"' || ? || '"'`,
                });
            }

            spinner.succeed(`Deleted old entries of ${file.file}`);
        }

        if (additions.length > 0) {
            const valuesToInsert = additions.map((line) => ({
                created,
                filename: fname,
                line: formatMarkdownLine(line),
                title: data.title,
                updated,
            }));

            spinner.text = `Adding new entries of ${file.file} ...`;
            spinner.start();

            await turso.batch(
                valuesToInsert.map((value) => ({
                    args: [
                        value.title,
                        value.line,
                        value.filename,
                        value.created,
                        value.updated,
                    ],
                    sql: 'INSERT INTO notes_fts (title, line, filename, created, updated) VALUES (?, ?, ?, ?, ?)',
                })),
                'write',
            );

            spinner.succeed(`Added new entries of ${file.file}`);
        }
    }
};

main().catch((error) => {
    spinner.fail('Failed to sync notes to database ...');
    logger.error(error);
});
