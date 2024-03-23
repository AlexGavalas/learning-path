import axios from 'axios';
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

export const getEnvVariable = (envVar: string): string => {
    const value = process.env[envVar];

    const valueExists =
        typeof value === 'string' && value !== 'undefined' && value !== 'null';

    if (!valueExists) {
        throw new Error(`${envVar} is not defined in env.`);
    }

    return value;
};

type UploadFileProps = {
    url: string;
    content: string;
    filename: string;
};

export const uploadFile = async ({
    url,
    content,
    filename,
}: UploadFileProps): Promise<void> => {
    try {
        const form = new FormData();
        form.append('md_file', new Blob([content]), filename);

        await axios.postForm(url, form);
    } catch (e) {
        logger.error(e);
    }
};

export const updateEdgeConfig = async (): Promise<void> => {
    const { rows } = await turso.execute(
        'SELECT DISTINCT(title), filename, created, updated FROM notes_fts ORDER BY updated DESC, title ASC',
    );

    try {
        const edgeConfig = getEnvVariable('EDGE_CONFIG_ID');
        const vercelAccessToken = getEnvVariable('VERCEL_ACCESS_TOKEN');

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
