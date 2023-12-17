import 'dotenv/config';
import matter from 'gray-matter';
import fs from 'node:fs/promises';
import { type SimpleGit, simpleGit } from 'simple-git';

import { supabase } from '~lib/supabase';
import type { NoteFrontmatter } from '~types/notes.types';

import { toISOString, updateEdgeConfig } from './helpers';

const main = async (): Promise<void> => {
    const git: SimpleGit = simpleGit({});

    const diffSummary = await git.diffSummary(['HEAD~', 'HEAD', 'src/content']);

    for (const file of diffSummary.files) {
        const fileContents = await fs.readFile(file.file, 'utf-8');

        const { data } = matter(fileContents) as unknown as {
            content: string;
            data: NoteFrontmatter;
        };

        if (data.published === false) {
            console.log(`Skipping ${file.file} as it is not published yet ...`);

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

            process.stdout.write(`Adding new entries of ${file.file} ...`);

            await supabase.from('notes').upsert(valuesToInsert);

            process.stdout.write(' [OK]\n');
        }

        if (deletions.length > 0) {
            process.stdout.write(`Deleting old entries of ${file.file} ...`);

            for (const line of deletions) {
                await supabase
                    .from('notes')
                    .delete()
                    .match({
                        line: line.replace(/^-/, '').replace(/^-\s*/, ''),
                    });
            }

            process.stdout.write(' [OK]\n');
        }
    }

    if (diffSummary.files.length > 0) {
        await updateEdgeConfig();
    }
};

main().catch(console.error);
