import { format } from '@formkit/tempo';
import matter from 'gray-matter';

import { getNoteMetadata } from '~api/notes-db';

import { updateEdgeConfig } from './edge-config';
import { readFile, toISOString, writeFile } from './helpers';
import { logger } from './logger';

export const updateMdTimestamps = async (files: string[]): Promise<void> => {
    for (const file of files) {
        const friendlyName = file.match(
            /(?<category>notes|lesson-summaries)\/.*/u,
        )?.[0];

        if (!friendlyName) {
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
                .match(/(?<category>notes|lesson-summaries)\/.*/u)?.[0]
                .replace('.mdx', ''),
        )
        .filter(Boolean);

    const updatedNoteMetadata = noteMetadata
        .map((note) => {
            if (friendlyNames.includes(`notes/${note.filename}`)) {
                return {
                    ...note,
                    updated: toISOString(new Date().toISOString()),
                };
            }

            return note;
        })
        .sort((noteMetaA, noteMetaB) => {
            const aDate = new Date(noteMetaA.updated);
            const bDate = new Date(noteMetaB.updated);

            const dateCmp = bDate.getTime() - aDate.getTime();

            if (dateCmp !== 0) {
                return dateCmp;
            }

            return noteMetaA.title.localeCompare(noteMetaB.title);
        });

    await updateEdgeConfig(updatedNoteMetadata);
};
