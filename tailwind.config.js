module.exports = {
    content: ['./src/**/*.tsx'],
    darkMode: 'class',
    theme: {
        extend: {
            animation: {
                loader: 'bg-size 2s linear infinite alternate',
            },
            keyframes: {
                'bg-size': {
                    to: {
                        'background-size': '100% 100%',
                    },
                },
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [require('@tailwindcss/typography')],
};
