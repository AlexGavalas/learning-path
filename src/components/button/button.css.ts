import { style, styleVariants } from '@vanilla-extract/css';

import { vars } from '../../styles/theme.css';

const base = style({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: vars.spacing.xs,
    border: 'none',
    color: vars.color.background,
    padding: vars.spacing.sm,
    ':active': {
        opacity: 0.8,
    },
});

const defaultVariant = style({
    backgroundColor: `oklch(from ${vars.color.primary} l c h)`,
    ':hover': {
        backgroundColor: `oklch(from ${vars.color.primary} calc(l + 0.1) c h)`,
    },
});

const wrapperVariant = style({
    backgroundColor: 'transparent',
    ':hover': {
        backgroundColor: `oklch(from ${vars.color.background} calc(l + 0.07) c h)`,
    },
});

export const button = styleVariants({
    default: [base, defaultVariant],
    wrapper: [base, wrapperVariant],
});
