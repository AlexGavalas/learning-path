import { getAllNotes } from '~api/notes-db';

import { logger } from './logger';

export const updateEdgeConfig = async (): Promise<void> => {
    try {
        const rows = await getAllNotes();

        const edgeConfig = process.env.EDGE_CONFIG_ID;
        const vercelAccessToken = process.env.VERCEL_ACCESS_TOKEN;

        const url = `https://api.vercel.com/v1/edge-config/${edgeConfig}/items`;

        const res = await fetch(url, {
            method: 'PATCH',
            body: JSON.stringify({
                items: [
                    {
                        operation: 'update',
                        key: 'meta',
                        value: rows,
                    },
                ],
            }),
            headers: {
                Authorization: `Bearer ${vercelAccessToken}`,
                'Content-Type': 'application/json',
            },
        });

        const responseData = (await res.json()) as unknown;

        logger.info('Update Edge Config response', responseData);
    } catch (e) {
        logger.error(e);
    }
};
