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
                'plugin:@typescript-eslint/eslint-recommended',
                'plugin:@typescript-eslint/recommended',
                'prettier',
            ],
            parserOptions: {
                project: './tsconfig.json',
            },
            rules: {
                '@typescript-eslint/array-type': 'off',
            },
        },
        {
            files: ['*.jsx', '*.tsx'],
            plugins: ['react'],
            extends: ['plugin:react/recommended', 'plugin:react/jsx-runtime'],
            settings: {
                react: {
                    version: 'detect',
                },
            },
        },
    ],
    ignorePatterns: ['env.d.ts'],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
};
