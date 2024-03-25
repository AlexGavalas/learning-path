import { parse } from '@formkit/tempo';
import fs from 'node:fs/promises';

export const toISOString = (date: string): string =>
    parse(date, 'YYYY-MM-DD').toISOString();

export const readFile = async (file: string): Promise<string> =>
    await fs.readFile(file, 'utf8');

export const writeFile = async (file: string, data: string): Promise<void> => {
    await fs.writeFile(file, data, 'utf8');
};
