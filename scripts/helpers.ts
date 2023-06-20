import axios from 'axios';
import { parse } from 'date-fns';
import fs from 'fs/promises';

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

export const uploadFile = async (
    url: string,
    content: string,
    filename: string,
): Promise<void> => {
    try {
        const form = new FormData();
        form.append('md_file', new Blob([content]), filename);

        await axios.postForm(url, form);
    } catch (e) {
        console.error(e);
    }
};
