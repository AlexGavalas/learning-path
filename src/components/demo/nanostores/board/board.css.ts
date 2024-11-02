import { style } from '@vanilla-extract/css';

import { vars } from '../../../../styles/theme.css';
import { BOARDS_NUM, NUM } from './constants';

export const demoContainer = style({
    display: 'grid',
    gap: '1rem',
    gridTemplateColumns: `repeat(${BOARDS_NUM}, 1fr)`,
    textAlign: 'center',
    margin: `${vars.spacing.md} auto`,
});

export const vanillaContainer = style({
    gridColumn: '1 / -1',
});

export const container = style({
    display: 'grid',
    placeItems: 'center',
});

export const title = style({
    textAlign: 'center',
    fontSize: '1.2em',
});

export const board = style({
    display: 'grid',
    gridTemplateColumns: `repeat(${NUM}, 1fr)`,
    gridTemplateRows: `repeat(${NUM}, 1fr)`,
    borderTop: `1px solid ${vars.color.border}`,
    width: 'min(100%, 25rem)',
    aspectRatio: '1',
});

export const column = style({
    borderLeft: '1px solid transparent',
    selectors: {
        '&:first-of-type': {
            borderLeft: `1px solid ${vars.color.border}`,
        },
    },
});

export const cell = style({
    aspectRatio: '1',
    borderRight: `1px solid ${vars.color.border}`,
    borderBottom: `1px solid ${vars.color.border}`,
    display: 'grid',
    placeItems: 'center',
});

export const noJSWarning = style({
    backgroundColor: vars.color.warning,
    padding: vars.spacing.md,
    borderRadius: vars.spacing.sm,
    color: vars.color.typography.warning,
});
