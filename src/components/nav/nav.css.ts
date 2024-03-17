import { style } from '@vanilla-extract/css';

import { vars } from '../../styles/theme.css';

export const navContainer = style({
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: vars.spacing.medium,
    color: vars.color.primary,
});

export const linkLabel = style({
    padding: vars.spacing.small,
});
