import { style } from '@vanilla-extract/css';

import { vars } from '../../styles/theme.css';

export const container = style({
    display: 'flex',
    flexDirection: 'column',
    gap: vars.spacing.xs,
});

export const link = style({
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    gap: vars.spacing.md,
    padding: vars.spacing.sm,
    borderRadius: vars.spacing.sm,
    fontVariantNumeric: 'tabular-nums',
    ':hover': {
        backgroundColor: vars.color.backgroundHover,
    },
});

export const text = style({
    color: vars.color.primary,
});

export const noNotes = style({
    textAlign: 'center',
});
