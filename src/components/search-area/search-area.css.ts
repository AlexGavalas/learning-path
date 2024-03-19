import { style } from '@vanilla-extract/css';

import { vars } from '../../styles/theme.css';

export const container = style({
    position: 'relative',
    display: 'flex',
    height: '4rem',
    alignItems: 'center',
});

export const searchButton = style({
    position: 'absolute',
    bottom: 0,
    right: 0,
    display: 'flex',
    height: '50%',
    padding: vars.spacing.xs,
    fontSize: '0.8em',
});

export const loader = style({
    position: 'absolute',
    bottom: '-8px',
    height: '2px',
    width: '100%',
});
