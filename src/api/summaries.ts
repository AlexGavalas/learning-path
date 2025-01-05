import { parse } from '@formkit/tempo';
import { getCollection } from 'astro:content';

import { turso } from '~lib/turso';
import type { Summary } from '~types/summaries';

const getAllSummaries = async (): Promise<Summary[]> => {
    const { rows } = await turso.execute(
        'SELECT * FROM summaries ORDER BY created DESC',
    );

    return rows as unknown as Summary[];
};

export const getSummaries = async (): Promise<Omit<Summary, 'id'>[] | null> => {
    const isProd = process.env.PROD === 'true';

    if (!isProd) {
        const entries = await getCollection('summaries');

        return entries
            .map((entry) => ({
                ...entry.data,
                filename: entry.id,
            }))
            .sort(
                (lessonA, lessonB) =>
                    parse(lessonB.created, 'YYYY-MM-DD').getTime() -
                    parse(lessonA.created, 'YYYY-MM-DD').getTime(),
            );
    }

    return await getAllSummaries();
};
