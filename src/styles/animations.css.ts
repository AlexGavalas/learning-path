import { keyframes } from '@vanilla-extract/css';

import { vars } from './theme.css';

export const aurora = keyframes({
    '0%': {
        backgroundColor: vars.color.primary,
    },
    '100%': {
        backgroundColor: vars.color.secondary,
    },
});

export const blink = keyframes({
    '0%, 100%': {
        opacity: 0.75,
    },
    '50%': {
        opacity: 0.5,
    },
});

export const fullSize = keyframes({
    to: {
        backgroundSize: '100% 100%',
    },
});

export const drawLine = keyframes({
    from: {
        strokeDashoffset: 200,
    },
    to: {
        strokeDashoffset: 0,
    },
});
