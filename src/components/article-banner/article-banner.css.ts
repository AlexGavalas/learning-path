import { style } from '@vanilla-extract/css';

import { aurora, blink } from '../../styles/animations.css';
import { vars } from '../../styles/theme.css';
import { CELLS_NUM, COLUMNS, INDEX_VAR, ITEM_STAGGER } from './config';

const TOTAL_STAGGER = CELLS_NUM * ITEM_STAGGER;

export const container = style({
    display: 'grid',
    gridTemplateColumns: `repeat(${COLUMNS}, 1fr)`,
    gap: vars.spacing.xs,
});

export const cell = style({
    animation: `3s ${blink} infinite alternate ease-in-out, 3s ${aurora} infinite alternate ease-in-out`,
    animationDelay: `calc(-1 * ${TOTAL_STAGGER}s + var(${INDEX_VAR}) * ${ITEM_STAGGER}s)`,
    aspectRatio: '1',
    backgroundColor: vars.color.primary,
    borderRadius: vars.spacing.xs,
});
