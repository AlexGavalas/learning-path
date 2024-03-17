import { keyframes, style } from '@vanilla-extract/css';

import { vars } from '../../styles/theme.css';
import { CELLS_NUM, COLUMNS, INDEX_VAR, ITEM_STAGGER } from './config';

const TOTAL_STAGGER = CELLS_NUM * ITEM_STAGGER;

const blink = keyframes({
    '0%, 100%': {
        opacity: 0.75,
    },
    '50%': {
        opacity: 0.25,
    },
});

export const container = style({
    display: 'grid',
    gridTemplateColumns: `repeat(${COLUMNS}, 1fr)`,
    gap: '0.3rem',
});

export const cell = style({
    animation: `3s ${blink} infinite alternate ease-in-out`,
    animationDelay: `calc(-1 * ${TOTAL_STAGGER}s + var(${INDEX_VAR}) * ${ITEM_STAGGER}s)`,
    aspectRatio: '1',
    backgroundColor: vars.color.primary,
    borderRadius: '20%',
});
