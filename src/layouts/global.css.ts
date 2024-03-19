import { globalStyle, style } from '@vanilla-extract/css';

import { vars } from '../styles/theme.css';

export const page = style({
    backgroundColor: vars.color.background,
});

export const mainContainer = style({
    display: 'flex',
    flexDirection: 'column',
    gap: vars.spacing.md,
    margin: 'auto',
    maxWidth: '42rem',
    padding: `0 ${vars.spacing.md}`,
});

globalStyle(':root :focus-visible', {
    outline: 'none',
    boxShadow: `0 0 0 2px ${vars.color.primary}`,
    borderRadius: '5px',
});

globalStyle(`:root ::selection`, {
    backgroundColor: vars.color.primary,
    color: vars.color.background,
});
