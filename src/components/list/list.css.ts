import { style } from '@vanilla-extract/css';

import { vars } from '../../styles/theme.css';

export const list = style({
    hyphens: 'auto',
    padding: vars.spacing.medium,
});
