import { keyframes } from '@vanilla-extract/css';

export const blink = keyframes({
    '0%, 100%': {
        opacity: 0.75,
    },
    '50%': {
        opacity: 0.25,
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
