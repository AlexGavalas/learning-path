import fs from 'fs';
import matter from 'gray-matter';
import simpleGit from 'simple-git';
import { format } from 'date-fns';

const git = simpleGit();

const readFile = (file: string) => fs.promises.readFile(file, 'utf8');

const writeFile = (file: string, data: string) =>
    fs.promises.writeFile(file, data, 'utf8');

const main = async () => {
    const output = await git.status(['posts']);

    if (output.staged.length === 0) {
        console.log('No posts in this commit.');
        return;
    }

    for (const file of output.staged) {
        console.log(`Updating timestamp of ${file} ...`);

        const fileContents = await readFile(file);

        const updatedContent = matter.stringify(fileContents, {
            updated: format(new Date(), 'yyyy-MM-dd'),
        });

        await writeFile(file, updatedContent);
    }

    console.log(`Updated ${output.modified.length} files.`);

    await git.add(output.staged);

    console.log('Added files to commit.');
};

main();
