import { type Config } from '@jest/types';
import { pathsToModuleNameMapper } from 'ts-jest';

import { compilerOptions } from './tsconfig.json';

const config: Config.InitialOptions = {
    collectCoverage: false,
    coverageReporters: ['text'],
    collectCoverageFrom: [
        'src/{components,features,hooks}/**/*.{ts,tsx}',
        '!**/index.ts',
    ],

    coverageThreshold: {
        global: {
            statements: 80,
            branches: 55,
            functions: 65,
            lines: 80,
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
