import { style } from '@vanilla-extract/css';

import { vars } from '../../styles/theme.css';

export const container = style({
    display: 'flex',
    flexDirection: 'column',
    gap: vars.spacing.lg,
});
