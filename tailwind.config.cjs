const typographyPlugin = require('@tailwindcss/typography');
const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    darkMode: 'class',
    future: {
        hoverOnlyWhenSupported: true,
    },
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
            colors: {
                dark: {
                    primary: colors.yellow[500],
                    background: '#121212',
                    border: colors.white,
                },
                light: {
                    primary: colors.teal[700],
                    background: '#ececec',
                    border: colors.slate[400],
                },
            },
            screens: {
                xs: '320px',
            },
        },
    },
    plugins: [
        typographyPlugin,
        function ({ addComponents, theme }) {
            addComponents({
                '*:focus-visible': {
                    outlineColor: theme('colors.light.primary'),
                },
                '.dark *:focus-visible': {
                    outlineColor: theme('colors.dark.primary'),
                },
                '.heading :where(h1, h2) a': {
                    color: theme('colors.light.primary'),
                },
                '.dark-heading :where(h1, h2) a': {
                    color: theme('colors.dark.primary'),
                },
                '.prose :where(a)': {
                    textDecorationColor: theme('colors.light.primary'),
                    textDecorationThickness: '0.125rem',
                    textUnderlineOffset: '0.125rem',
                },
                '.dark .prose :where(a)': {
                    textDecorationColor: theme('colors.dark.primary'),
                    textDecorationThickness: '0.125rem',
                    textUnderlineOffset: '0.125rem',
                },
            });
        },
    ],
};
