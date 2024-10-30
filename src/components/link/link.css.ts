import { style } from '@vanilla-extract/css';

import { vars } from '../../styles/theme.css';

export const link = style({
    color: vars.color.primary,
    cursor: 'pointer',
    display: 'inline-block',
    textDecorationThickness: 2,
    textUnderlineOffset: 4,
    selectors: {
        '&:hover': {
            textDecorationLine: 'underline',
        },
    },
});
