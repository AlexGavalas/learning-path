import js from '@eslint/js';
import vitest from '@vitest/eslint-plugin';
import astro from 'eslint-plugin-astro';
import ts from 'typescript-eslint';

export default [
    js.configs.all,
    ...ts.configs.recommendedTypeChecked,
    ...astro.configs['flat/recommended'],
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
            'max-lines-per-function': ['error', { max: 120 }],
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
            vitest,
        },
        rules: {
            ...vitest.configs.recommended.rules,
            'no-magic-numbers': 'off',
            'no-undefined': 'off',
            'max-lines-per-function': 'off',
            '@typescript-eslint/consistent-type-imports': 'off',
            '@typescript-eslint/unbound-method': 'off',
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
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
            '@typescript-eslint/no-misused-promises': 'off',
        },
    },
    {
        ignores: ['*.config.js', '.astro', 'dist', '**/*.d.ts', 'coverage'],
    },
];
