import { style } from '@vanilla-extract/css';

import { vars } from '../../styles/theme.css';

export const buttonCn = style({
    display: 'inline-block',
    padding: `0 ${vars.spacing.sm}`,
});
