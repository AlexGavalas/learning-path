import { assignVars, createThemeContract, style } from '@vanilla-extract/css';

const SPACING = {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
} as const;

export const SCREEN = {
    xs: '320px',
    sm: '640px',
} as const;

export const vars = createThemeContract({
    spacing: SPACING,
    color: {
        primary: '',
        secondary: '',
        border: '',
        background: '',
        warning: '',
        typography: {
            primary: '',
            warning: '',
        },
        input: {
            background: '',
        },
    },
});

const configureTheme = ({
    background,
    primary,
    secondary,
}: {
    background: string;
    primary: string;
    secondary: string;
}) =>
    style({
        vars: assignVars(vars, {
            spacing: SPACING,
            color: {
                primary,
                secondary,
                border: primary,
                background,
                warning: '#eed202',
                typography: {
                    primary: `oklch(from ${primary} calc(l + 0.1) 0 0)`,
                    warning: '#000000',
                },
                input: {
                    background: `oklch(from ${background} calc(l + 0.05) c calc(h + 0.2))`,
                },
            },
        }),
    });

const LIGHT = {
    // Forest Green
    PRIMARY: 'oklch(0.36 0.1 149)',
    // Charcoal Gray
    SECONDARY: 'oklch(0.23 0 0)',
    // Snow White
    BACKGROUND: 'oklch(0.9 0 0)',
};

export const lightTheme = configureTheme({
    background: LIGHT.BACKGROUND,
    primary: LIGHT.PRIMARY,
    secondary: LIGHT.SECONDARY,
});

const DARK = {
    // Icy Blue
    PRIMARY: 'oklch(0.65 0.12 225)',
    // Aurora Purple
    SECONDARY: '#98478B',
    // Charcoal Gray
    BACKGROUND: 'oklch(0.23 0 0)',
};

export const darkTheme = configureTheme({
    background: DARK.BACKGROUND,
    primary: DARK.PRIMARY,
    secondary: DARK.SECONDARY,
});
