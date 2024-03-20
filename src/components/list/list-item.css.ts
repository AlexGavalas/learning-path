import { globalStyle, style } from '@vanilla-extract/css';

import { vars } from '../../styles/theme.css';

export const item = style({
    listStyleType: 'disc',
    fontSize: '0.9em',
});

globalStyle(`${item}::marker`, {
    color: vars.color.primary,
});
