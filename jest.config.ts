import type { Config } from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';

import { compilerOptions } from './tsconfig.json';

const config: Config = {
    clearMocks: true,

    collectCoverage: false,
    coverageReporters: ['text'],
    collectCoverageFrom: ['!**/index.ts'],

    coverageThreshold: {
        global: {
            statements: 95,
            branches: 90,
            functions: 95,
            lines: 95,
        },
    },

    testEnvironment: 'jsdom',

    testPathIgnorePatterns: ['e2e'],

    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                tsconfig: './tsconfig.test.json',
                isolatedModules: true,
            },
        ],
    },

    globalSetup: '<rootDir>/src/test/setup-global.ts',
    setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],

    roots: ['<rootDir>'],
    modulePaths: [compilerOptions.baseUrl],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
};

export default config;
