import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    collectCoverage: false,
    coverageReporters: ['text'],
    collectCoverageFrom: ['**/*.tsx'],

    testEnvironment: 'jsdom',

    preset: 'ts-jest',

    setupFilesAfterEnv: ['<rootDir>/setup-tests.ts'],
};

export default config;
