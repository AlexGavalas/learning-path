import { parse } from 'date-fns';
import fs from 'fs';

export const toISOString = (date: string): string =>
    parse(date, 'yyyy-MM-dd', new Date()).toISOString();

export const readFile = async (file: string): Promise<string> =>
    await fs.promises.readFile(file, 'utf8');

export const writeFile = async (file: string, data: string): Promise<void> => {
    await fs.promises.writeFile(file, data, 'utf8');
};

export const getEnvVariable = (envVar: string): string => {
    const value = process.env[envVar];

    if (typeof value !== 'string') {
        console.log(`${envVar} is not defined in env.`);
        process.exit(1);
    }

    return value;
};
