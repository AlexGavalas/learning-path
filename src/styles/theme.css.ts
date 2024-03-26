import { assignVars, createThemeContract, style } from '@vanilla-extract/css';

const SPACING = {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '2rem',
} as const;

export const SCREEN = {
    xs: '320px',
    sm: '640px',
} as const;

export const vars = createThemeContract({
    spacing: {
        xs: '',
        sm: '',
        md: '',
        lg: '',
    },
    color: {
        primary: '',
        secondary: '',
        border: '',
        background: '',
        backgroundHover: '',
        typography: {
            primary: '',
        },
        button: {
            background: '',
            text: '',
            hover: {
                background: '',
            },
        },
        input: {
            background: '',
        },
    },
});

export const lightTheme = style({
    vars: assignVars(vars, {
        spacing: SPACING,
        color: {
            primary: '#0f766e',
            secondary: '#475569',
            border: '#cbd5e1',
            background: '#fefefe',
            backgroundHover: '#e2e2e2',
            typography: {
                primary: '#000000',
            },
            button: {
                background: '#4f6179',
                text: '#ececec',
                hover: {
                    background: '#64748b',
                },
            },
            input: {
                background: '#ffffff',
            },
        },
    }),
});

export const darkTheme = style({
    vars: assignVars(vars, {
        spacing: SPACING,
        color: {
            primary: '#eab308',
            secondary: '#94a3b8',
            border: '#27272a',
            background: '#121212',
            backgroundHover: '#262626',
            typography: {
                primary: '#d1d5db',
            },
            button: {
                background: '#475569',
                text: '#ffffff',
                hover: {
                    background: '#64748b',
                },
            },
            input: {
                background: '#262626',
            },
        },
    }),
});
