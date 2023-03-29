import typographyPlugin from '@tailwindcss/typography';
import { type Config } from 'tailwindcss';
import colors from 'tailwindcss/colors';
import { fontFamily } from 'tailwindcss/defaultTheme';

const config: Config = {
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
    plugins: [typographyPlugin],
};

export default config;
