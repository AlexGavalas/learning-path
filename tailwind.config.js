const { fontFamily } = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
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
            fontFamily: {
                sans: ['var(--font-zilla-slab)', ...fontFamily.sans],
            },
            colors: {
                dark: {
                    primary: colors.yellow[500],
                },
                light: {
                    primary: colors.teal[700],
                },
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [require('@tailwindcss/typography')],
};
