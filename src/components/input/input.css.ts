import { style } from '@vanilla-extract/css';

import { vars } from '../../styles/theme.css';

export const container = style({
    display: 'grid',
    gap: vars.spacing.sm,
});

export const input = style({
    backgroundColor: vars.color.input.background,
    borderRadius: vars.spacing.xs,
    border: 'none',
    fontSize: '0.9em',
    lineHeight: 1.7,
    paddingLeft: vars.spacing.sm,
    '::placeholder': {
        color: `oklch(from ${vars.color.typography.primary} calc(l + 0.02) c h)`,
        opacity: 0.6,
    },
});
