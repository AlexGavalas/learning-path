import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    collectCoverage: false,
    coverageReporters: ['text'],
    collectCoverageFrom: ['**/*.tsx'],

    testEnvironment: 'jsdom',

    transform: {
        '^.+\\.tsx?$': ['ts-jest', { tsconfig: './tsconfig.test.json' }],
    },

    setupFilesAfterEnv: ['<rootDir>/setup-tests.ts'],
};

export default config;
