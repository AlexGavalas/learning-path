import { style } from '@vanilla-extract/css';

import { vars } from '../../styles/theme.css';

export const container = style({
    position: 'relative',
    display: 'grid',
    gap: vars.spacing.sm,
    gridTemplateColumns: '1fr auto',
    gridTemplateAreas: `"input ." "input button"`,
    '@media': {
        'screen and (max-width: 360px)': {
            gridTemplateColumns: '1fr',
        },
    },
});

export const input = style({
    display: 'grid',
    gap: vars.spacing.sm,
    gridArea: 'input',
    gridTemplateRows: 'subgrid',
});

export const searchButton = style({
    padding: `${vars.spacing.xs} ${vars.spacing.md} !important`,
    fontSize: '0.9em',
    gridArea: 'button',
});

export const loader = style({
    position: 'absolute',
    bottom: '-8px',
    height: '2px',
    width: '100%',
});
