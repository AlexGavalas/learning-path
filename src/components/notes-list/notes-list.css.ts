import { style } from '@vanilla-extract/css';

import { pulse } from '../../styles/animations.css';
import { vars } from '../../styles/theme.css';

export const item = style({
    selectors: {
        '&:not(:last-child)': {
            borderBottom: `2px solid ${vars.color.border}`,
        },
    },
});

export const link = style({
    display: 'grid',
    gridTemplateColumns: 'auto 1fr auto',
    gap: vars.spacing.medium,
    padding: vars.spacing.small,
    ':hover': {
        backgroundColor: vars.color.backgroundHover,
    },
    selectors: {
        '&:hover::after': {
            animation: `${pulse} 1s linear infinite alternate`,
            content: '⇝',
        },
    },
});

export const text = style({
    color: vars.color.primary,
});

export const noNotes = style({
    textAlign: 'center',
});
