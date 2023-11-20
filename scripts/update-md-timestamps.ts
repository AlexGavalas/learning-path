import { format } from 'date-fns';
import matter from 'gray-matter';

import { readFile, writeFile } from './helpers';

export const updateMdTimestamps = async (files: string[]): Promise<void> => {
    for (const file of files) {
        const friendlyName = file.match(/((notes|lesson-summaries)\/.*)/)?.[0];

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
