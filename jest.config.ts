import type { Config } from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';

import { compilerOptions } from './tsconfig.json';

const config: Config = {
    clearMocks: true,
    globalSetup: '<rootDir>/src/test/setup-global.ts',
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
    modulePaths: [compilerOptions.baseUrl],
    roots: ['<rootDir>'],
    testPathIgnorePatterns: ['e2e'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
};

export default config;
