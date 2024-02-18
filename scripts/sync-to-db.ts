import matter from 'gray-matter';
import fs from 'node:fs/promises';
import ora from 'ora';
import { type SimpleGit, simpleGit } from 'simple-git';

import { db } from '~lib/sqlite';
import type { NoteFrontmatter } from '~types/notes.types';

import { toISOString } from './helpers';
import { logger } from './logger';

const spinner = ora();

const main = async (): Promise<void> => {
    const git: SimpleGit = simpleGit({});

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
            file.file,
        ]);

        const lines = diff
            .split('\n')
            .filter(
                (line) =>
                    !/^[+-]title:\s/.test(line) &&
                    !/^[+-]created:\s/.test(line) &&
                    !/^[+-]updated:\s/.test(line) &&
                    !/^[+-]published:\s/.test(line),
            )
            .filter(
                (line) =>
                    !line.startsWith('+++') &&
                    !line.startsWith('---') &&
                    !/^[+-]\s*#+\s/.test(line) &&
                    /^[+-]{1}/.test(line),
            );

        const additions = lines.filter((line) => line.startsWith('+'));
        const deletions = lines.filter((line) => line.startsWith('-'));

        const fname = file.file.match(/([^/]*)\.mdx$/)?.[1] ?? '';
        const created = toISOString(data.created);
        const updated = toISOString(data.updated);

        if (additions.length > 0) {
            const valuesToInsert = additions.map((line) => ({
                title: data.title,
                line: line.replace(/^\+/, '').replace(/^-\s*/, ''),
                filename: fname,
                created,
                updated,
            }));

            spinner.text = `Adding new entries of ${file.file} ...`;
            spinner.start();

            const insertNote = db.prepare(
                'INSERT INTO notes (title, line, filename, created, updated) VALUES (@title, @line, @filename, @created, @updated)',
            );

            for (const value of valuesToInsert) {
                insertNote.run(value);
            }

            spinner.succeed(`Added new entries of ${file.file}`);
        }

        if (deletions.length > 0) {
            spinner.text = `Deleting old entries of ${file.file} ...`;
            spinner.start();

            const removeNote = db.prepare(
                'DELETE FROM notes WHERE filename = @filename AND line = @line',
            );

            for (const line of deletions) {
                const removedLine = line.replace(/^-/, '').replace(/^-\s*/, '');

                removeNote.run({
                    filename: fname,
                    line: removedLine,
                });
            }

            spinner.succeed(`Deleted old entries of ${file.file}`);
        }
    }

    if (diffSummary.files.length > 0) {
        await git.add('notes-db.sqlite');
        await git.commit('chore: sync notes to database');
    }
};

main().catch((e) => {
    spinner.fail('Failed to sync notes to database ...');
    logger.error(e);
});
