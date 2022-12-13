import type { Config } from '@jest/types';
import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

const config: Config.InitialOptions = {
    collectCoverage: false,
    coverageReporters: ['text'],
    collectCoverageFrom: ['**/*.tsx'],

    coverageThreshold: {
        global: {
            statements: 34,
            branches: 27,
            functions: 30,
            lines: 34,
        },
    },

    testEnvironment: 'jsdom',

    transform: {
        '^.+\\.tsx?$': ['ts-jest', { tsconfig: './tsconfig.test.json' }],
    },

    setupFilesAfterEnv: ['<rootDir>/setup-tests.ts'],

    roots: ['<rootDir>'],
    modulePaths: [compilerOptions.baseUrl],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
};

export default config;
