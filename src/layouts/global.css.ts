import { globalStyle, style } from '@vanilla-extract/css';

import { vars } from '../styles/theme.css';

export const body = style({
    backgroundColor: vars.color.primary,
});

export const mainContainer = style({
    display: 'flex',
    flexDirection: 'column',
    gap: vars.spacing.medium,
    margin: 'auto',
    maxWidth: '42rem',
    padding: `0 ${vars.spacing.medium}`,
});

globalStyle(':root :focus-visible', {
    outline: 'none',
    boxShadow: `0 0 0 2px ${vars.color.primary}`,
    borderRadius: '5px',
});

globalStyle(`${mainContainer} ::selection`, {
    backgroundColor: vars.color.primary,
    color: vars.color.background,
});
