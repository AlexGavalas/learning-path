import { style } from '@vanilla-extract/css';

import { vars } from '../../styles/theme.css';

export const container = style({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: `1px solid ${vars.color.border}`,
});

export const logo = style({
    margin: `${vars.spacing.sm} 0`,
    padding: vars.spacing.sm,
    width: '30%',
    minWidth: '150px',
    borderRadius: vars.spacing.xs,
    ':hover': {
        backgroundColor: `oklch(from ${vars.color.background} calc(l + 0.07) c h)`,
    },
});
