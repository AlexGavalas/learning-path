import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    collectCoverage: false,
    coverageReporters: ['text'],
    collectCoverageFrom: ['**/*.tsx'],

    coverageThreshold: {
        global: {
            statements: 14,
            branches: 5,
            functions: 15,
            lines: 13,
        },
    },

    testEnvironment: 'jsdom',

    transform: {
        '^.+\\.tsx?$': ['ts-jest', { tsconfig: './tsconfig.test.json' }],
    },

    setupFilesAfterEnv: ['<rootDir>/setup-tests.ts'],
};

export default config;
