import conventionalConfig from '@commitlint/config-conventional';

export default {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'type-enum': [
            2,
            'always',
            [...conventionalConfig.rules['type-enum'][2], 'content'],
        ],
    },
};
