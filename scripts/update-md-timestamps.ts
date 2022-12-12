import fs from 'fs';
import matter from 'gray-matter';
import { format } from 'date-fns';

const readFile = (file: string) => fs.promises.readFile(file, 'utf8');

const writeFile = (file: string, data: string) =>
    fs.promises.writeFile(file, data, 'utf8');

const main = async () => {
    const files = process.argv.slice(2);

    for (const file of files) {
        const friendlyName = file.match(/(posts\/.*)/)?.[0];

        console.log(`Updating timestamp of ${friendlyName} ...`);

        const fileContents = await readFile(file);

        const updatedContent = matter.stringify(fileContents, {
            updated: format(new Date(), 'yyyy-MM-dd'),
        });

        await writeFile(file, updatedContent);
    }

    console.log(`Updated ${files.length} files.`);
};

main();
