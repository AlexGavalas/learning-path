import { style } from '@vanilla-extract/css';

import { vars } from '../../styles/theme.css';

export const container = style({
    position: 'relative',
    display: 'grid',
    gap: vars.spacing.xs,
    gridTemplateColumns: '1fr auto',
    '@media': {
        'screen and (max-width: 360px)': {
            gridTemplateColumns: '1fr',
        },
    },
});

export const input = style({
    height: '100%',
});

export const searchButton = style({
    padding: `${vars.spacing.xs} ${vars.spacing.md}`,
    fontSize: '0.8em',
});

export const loader = style({
    position: 'absolute',
    bottom: '-8px',
    height: '2px',
    width: '100%',
});
