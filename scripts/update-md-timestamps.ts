import { format } from 'date-fns';
import matter from 'gray-matter';

import { readFile, writeFile } from './helpers';

const main = async (): Promise<void> => {
    const files = process.argv.slice(2);

    for (const file of files) {
        const friendlyName = file.match(/((notes|summaries)\/.*)/)?.[0];

        if (friendlyName === undefined) {
            console.error(`Incorrect file passed. Skipping ${file} ...`);
            return;
        }

        console.log(`Updating timestamp of ${friendlyName} ...`);

        const fileContents = await readFile(file);

        const updatedContent = matter.stringify(fileContents, {
            updated: format(new Date(), 'yyyy-MM-dd'),
        });

        await writeFile(file, updatedContent);
    }

    console.log('Updated timestamps.');
};

main().catch((e) => {
    console.error(e);
});
