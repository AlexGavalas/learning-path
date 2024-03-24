import { parse } from 'date-fns';
import fs from 'node:fs/promises';

import { turso } from '~lib/turso';

import { logger } from './logger';

export const toISOString = (date: string): string =>
    parse(date, 'yyyy-MM-dd', new Date()).toISOString();

export const readFile = async (file: string): Promise<string> =>
    await fs.readFile(file, 'utf8');

export const writeFile = async (file: string, data: string): Promise<void> => {
    await fs.writeFile(file, data, 'utf8');
};

export const updateEdgeConfig = async (): Promise<void> => {
    try {
        const { rows } = await turso.execute(
            'SELECT DISTINCT(title), filename, created, updated FROM notes ORDER BY updated DESC, title ASC',
        );

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
