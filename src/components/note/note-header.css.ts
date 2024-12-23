import { style } from '@vanilla-extract/css';

import { SCREEN, vars } from '../../styles/theme.css';

export const title = style({
    fontSize: '2em',
});

export const container = style({
    display: 'flex',
    gap: vars.spacing.md,
    color: vars.color.primary,
    '@media': {
        [`screen and (max-width: ${SCREEN.sm})`]: {
            flexDirection: 'column',
        },
    },
});

export const separator = style({
    display: 'block',
    '@media': {
        [`screen and (max-width: ${SCREEN.sm})`]: {
            display: 'none',
        },
    },
});
