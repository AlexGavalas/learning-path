import js from '@eslint/js';
import astroEslint from 'eslint-plugin-astro';
import jestEslint from 'eslint-plugin-jest';
import tsEslint from 'typescript-eslint';

export default [
    js.configs.all,
    ...tsEslint.configs.recommendedTypeChecked,
    ...astroEslint.configs['flat/recommended'],
    {
        languageOptions: {
            parserOptions: {
                project: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            'sort-imports': 'off',
            'one-var': 'off',
            'no-await-in-loop': 'off',
            'no-continue': 'off',
            'no-ternary': 'off',
            'no-magic-numbers': [
                'error',
                {
                    // Allow use of 0
                    ignore: [0],
                    ignoreArrayIndexes: true,
                },
            ],
            'id-length': [
                'error',
                {
                    // Allow _ for unused variables
                    exceptions: ['_'],
                },
            ],
            'max-lines-per-function': ['error', { max: 100 }],
            'max-statements': ['error', { max: 30 }],
        },
    },
    {
        files: ['**/*.ts'],
        rules: {
            '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
            '@typescript-eslint/consistent-type-imports': [
                'error',
                {
                    disallowTypeAnnotations: false,
                },
            ],
        },
    },
    {
        files: ['**/*.test.ts', '**/*.test.tsx'],
        plugins: {
            jest: jestEslint,
        },
        rules: {
            'no-magic-numbers': 'off',
            'no-undefined': 'off',
            'max-lines-per-function': 'off',
            '@typescript-eslint/consistent-type-imports': 'off',
            '@typescript-eslint/unbound-method': 'off',
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            'jest/consistent-test-it': ['error', { fn: 'it' }],
            'jest/max-expects': ['warn', { max: 3 }],
            'jest/max-nested-describe': ['error', { max: 3 }],
            'jest/no-conditional-in-test': 'error',
            'jest/no-confusing-set-timeout': 'error',
            'jest/no-duplicate-hooks': 'error',
            'jest/no-test-return-statement': 'error',
            'jest/no-untyped-mock-factory': 'warn',
            'jest/prefer-called-with': 'warn',
            'jest/prefer-comparison-matcher': 'error',
            'jest/prefer-equality-matcher': 'error',
            'jest/prefer-expect-resolves': 'warn',
            'jest/prefer-hooks-in-order': 'error',
            'jest/prefer-hooks-on-top': 'error',
            'jest/prefer-lowercase-title': 'error',
            'jest/prefer-mock-promise-shorthand': 'error',
            'jest/prefer-spy-on': 'warn',
            'jest/prefer-strict-equal': 'error',
            'jest/require-hook': 'warn',
            'jest/require-to-throw-message': 'error',
            'jest/require-top-level-describe': 'error',
        },
    },
    {
        files: ['e2e/**'],
        rules: {
            'jest/require-hook': 'off',
        },
    },
    {
        files: ['**/*.css.ts'],
        rules: {
            'sort-keys': 'off',
        },
    },
    {
        files: ['**/*.astro'],
        rules: {
            'consistent-return': 'off',
            'no-useless-assignment': 'off',
        },
    },
    {
        ignores: ['*.config.js', '.astro/', '**/*.d.ts'],
    },
];
