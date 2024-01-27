/** @type {import('eslint').ESLint.ConfigData} */
module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: ['eslint:recommended', 'prettier'],
    overrides: [
        {
            files: ['.eslintrc.{js,cjs}'],
            parserOptions: {
                sourceType: 'script',
            },
        },
        {
            files: ['*.ts', '*.tsx'],
            parser: '@typescript-eslint/parser',
            plugins: ['@typescript-eslint/eslint-plugin'],
            extends: [
                'standard-with-typescript',
                'eslint:recommended',
                'plugin:@typescript-eslint/eslint-recommended',
                'plugin:@typescript-eslint/recommended',
                'plugin:@typescript-eslint/strict-type-checked',
                'plugin:@typescript-eslint/stylistic-type-checked',
                'prettier',
            ],
            parserOptions: {
                project: './tsconfig.json',
            },
            rules: {
                '@typescript-eslint/array-type': 'off',
                '@typescript-eslint/consistent-type-definitions': [
                    'error',
                    'type',
                ],
                '@typescript-eslint/consistent-type-imports': [
                    'error',
                    {
                        disallowTypeAnnotations: false,
                    },
                ],
                '@typescript-eslint/no-confusing-void-expression': 'off',
            },
        },
        {
            files: ['*.test.ts', '*.test.tsx'],
            excludedFiles: ['e2e/**/*'],
            plugins: ['jest'],
            env: {
                jest: true,
            },
            extends: ['plugin:jest/recommended', 'plugin:jest/style'],
            rules: {
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
    ],
    ignorePatterns: ['env.d.ts', 'database.types.ts'],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
};
