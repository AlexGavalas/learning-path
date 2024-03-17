import { keyframes, style } from '@vanilla-extract/css';

import { vars } from '../../styles/theme.css';

const draw = keyframes({
    from: {
        strokeDashoffset: 200,
    },
    to: {
        strokeDashoffset: 0,
    },
});

export const container = style({
    verticalAlign: 'middle',
});

export const logo = style({
    fill: vars.color.primary,
    stroke: vars.color.primary,
    strokeWidth: 1,
    strokeLinecap: 'round',
    strokeDasharray: '200 200',
    animation: `${draw} 3s linear forwards`,
});
