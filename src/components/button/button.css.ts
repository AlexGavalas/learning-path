import { style, styleVariants } from '@vanilla-extract/css';

import { vars } from '../../styles/theme.css';

const base = style({
    display: 'flex',
    alignItems: 'center',
    borderRadius: '5px',
    border: 'none',
    color: vars.color.button.text,
    padding: vars.spacing.small,
    ':active': {
        opacity: 0.8,
    },
});

const defaultVariant = style({
    backgroundColor: vars.color.button.background,
    ':hover': {
        backgroundColor: vars.color.button.hover.background,
    },
});

const wrapperVariant = style({
    backgroundColor: 'transparent',
    ':hover': {
        backgroundColor: vars.color.backgroundHover,
    },
});

export const button = styleVariants({
    default: [base, defaultVariant],
    wrapper: [base, wrapperVariant],
});
