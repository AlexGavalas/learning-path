import type { Config } from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';

import { compilerOptions } from './tsconfig.json';

const config: Config = {
    clearMocks: true,
    collectCoverage: false,
    collectCoverageFrom: ['!**/index.ts'],
    coverageReporters: ['text'],
    coverageThreshold: {
        global: {
            branches: 90,
            functions: 95,
            lines: 95,
            statements: 95,
        },
    },
    globalSetup: '<rootDir>/src/test/setup-global.ts',
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
    modulePaths: [compilerOptions.baseUrl],
    roots: ['<rootDir>'],
    setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
    testPathIgnorePatterns: ['e2e'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
};

export default config;
