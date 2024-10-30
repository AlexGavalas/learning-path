import { style } from '@vanilla-extract/css';

import { drawLine } from '../../styles/animations.css';
import { vars } from '../../styles/theme.css';

export const container = style({
    verticalAlign: 'middle',
});

export const logo = style({
    fill: `oklch(from ${vars.color.primary} calc(l + 0.15) c h)`,
    stroke: `oklch(from ${vars.color.primary} calc(l + 0.15) c h)`,
    strokeWidth: 1,
    strokeLinecap: 'round',
    strokeDasharray: '200 200',
    animation: `${drawLine} 3s linear forwards`,
});
