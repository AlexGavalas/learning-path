import axios from 'axios';
import fs from 'fs/promises';

import {
    getEnvVariable,
    readFile,
    toISOString,
    uploadFile,
    writeFile,
} from './helpers';

jest.mock('fs/promises');
jest.mock('axios');

describe('getEnvVariable', () => {
    const envVar = 'TEST_ENV_VAR';

    afterEach(() => {
        process.env[envVar] = undefined;
    });

    describe('when the environment variable is defined', () => {
        const value = 'test value';

        beforeAll(() => {
            process.env[envVar] = value;
        });

        it('returns its value', () => {
            expect(getEnvVariable(envVar)).toEqual(value);
        });
    });

    describe('when the environment variable is "undefined"', () => {
        beforeAll(() => {
            process.env[envVar] = 'undefined';
        });

        it('throws an error', () => {
            expect(() => getEnvVariable(envVar)).toThrowError(
                `${envVar} is not defined in env.`,
            );
        });
    });

    describe('when the environment variable is "null"', () => {
        const envVar = 'TEST_ENV_VAR';

        beforeAll(() => {
            process.env[envVar] = 'null';
        });

        it('throws an error', () => {
            expect(() => getEnvVariable(envVar)).toThrowError(
                `${envVar} is not defined in env.`,
            );
        });
    });

    describe('when the environment variable is not defined', () => {
        beforeAll(() => {
            process.env[envVar] = undefined;
        });

        it('throws an error', () => {
            expect(() => getEnvVariable(envVar)).toThrowError(
                `${envVar} is not defined in env.`,
            );
        });
    });
});

describe('toISOString', () => {
    describe('when the date is in the format yyyy-MM-dd', () => {
        const date = '2020-01-01';

        it('returns the date in ISO format', () => {
            expect(toISOString(date)).toBe('2020-01-01T00:00:00.000Z');
        });
    });

    describe('when the date is not in the format yyyy-MM-dd', () => {
        const date = '01-01-2020';

        it('throws an error', () => {
            expect(() => toISOString(date)).toThrowError('Invalid time value');
        });
    });
});

describe('readFile', () => {
    it('calls readFile from fs/promises with the correct arguments', async () => {
        await readFile('test-file');

        expect(fs.readFile).toHaveBeenCalledTimes(1);
        expect(fs.readFile).toHaveBeenCalledWith('test-file', 'utf8');
    });
});

describe('writeFile', () => {
    it('calls writeFile from fs/promises with the correct arguments', async () => {
        await writeFile('test-file', 'contents');

        expect(fs.writeFile).toHaveBeenCalledTimes(1);
        expect(fs.writeFile).toHaveBeenCalledWith(
            'test-file',
            'contents',
            'utf8',
        );
    });
});

describe('uploadFile', () => {
    const url = 'test-url';
    const content = 'test-content';
    const filename = 'test-filename';

    it('calls postForm from axios with the correct arguments', async () => {
        await uploadFile({ url, content, filename });

        expect(axios.postForm).toHaveBeenCalledTimes(1);
        expect(axios.postForm).toHaveBeenCalledWith(url, expect.any(FormData));
    });
});
