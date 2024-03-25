import { format } from '@formkit/tempo';
import matter from 'gray-matter';

import { getNoteMetadata } from '~api/notes-db';

import { updateEdgeConfig } from './edge-config';
import { readFile, writeFile } from './helpers';
import { logger } from './logger';

export const updateMdTimestamps = async (files: string[]): Promise<void> => {
    for (const file of files) {
        const friendlyName = file.match(/((notes|lesson-summaries)\/.*)/)?.[0];

        if (friendlyName === undefined) {
            logger.error(`Incorrect file passed. Skipping ${file} ...`);
            continue;
        }

        logger.debug(`Updating timestamp of ${friendlyName} ...`);

        const fileContents = await readFile(file);

        const updatedContent = matter.stringify(fileContents, {
            updated: format(new Date(), 'YYYY-MM-DD'),
        });

        await writeFile(file, updatedContent);
    }

    logger.info('Updated timestamps.');

    const noteMetadata = await getNoteMetadata();

    const friendlyNames = files
        .map((file) =>
            file
                .match(/((notes|lesson-summaries)\/.*)/)?.[0]
                .replace('.mdx', ''),
        )
        .filter(Boolean);

    const updatedNoteMetadata = noteMetadata
        .map((note) => {
            if (friendlyNames.includes(note.filename)) {
                return {
                    ...note,
                    updated: new Date().toISOString(),
                };
            }

            return note;
        })
        .sort((a, b) => {
            const aDate = new Date(a.updated);
            const bDate = new Date(b.updated);

            return bDate.getTime() - aDate.getTime();
        });

    await updateEdgeConfig(updatedNoteMetadata);
};
