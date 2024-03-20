import { style } from '@vanilla-extract/css';

import { drawLine } from '../../styles/animations.css';
import { vars } from '../../styles/theme.css';

export const container = style({
    verticalAlign: 'middle',
});

export const logo = style({
    fill: vars.color.primary,
    stroke: vars.color.primary,
    strokeWidth: 1,
    strokeLinecap: 'round',
    strokeDasharray: '200 200',
    animation: `${drawLine} 3s linear forwards`,
});
