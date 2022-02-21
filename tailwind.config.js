module.exports = {
    content: [
        './pages/**/*.tsx',
        './components/**/*.tsx',
        './features/**/*.tsx',
    ],
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
