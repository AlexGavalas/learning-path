import { getAllNotes } from '~api/notes-db';
import { type Note } from '~types/notes.types';

import { logger } from './logger';

export const updateEdgeConfig = async (data?: Note[]): Promise<void> => {
    try {
        const rows = data ?? (await getAllNotes());

        const edgeConfig = process.env.EDGE_CONFIG_ID;
        const vercelAccessToken = process.env.VERCEL_ACCESS_TOKEN;

        const url = `https://api.vercel.com/v1/edge-config/${edgeConfig}/items`;

        const res = await fetch(url, {
            body: JSON.stringify({
                items: [
                    {
                        key: 'meta',
                        operation: 'update',
                        value: rows,
                    },
                ],
            }),
            headers: {
                Authorization: `Bearer ${vercelAccessToken}`,
                'Content-Type': 'application/json',
            },
            method: 'PATCH',
        });

        const responseData = (await res.json()) as unknown;

        logger.info('Update Edge Config response', responseData);
    } catch (error) {
        logger.error(error);
    }
};
