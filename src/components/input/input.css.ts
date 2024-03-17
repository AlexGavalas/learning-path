import { style } from '@vanilla-extract/css';

import { vars } from '../../styles/theme.css';

export const container = style({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
});

export const input = style({
    backgroundColor: vars.color.input.background,
    borderRadius: '5px',
    border: `2px solid ${vars.color.border}`,
    fontSize: '0.8em',
    paddingLeft: vars.spacing.small,
    '::placeholder': {
        color: vars.color.secondary,
        opacity: 0.6,
    },
});
