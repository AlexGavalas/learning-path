/* eslint-disable id-length */
import { atom } from 'nanostores';

import { BOARDS_NUM, NUM } from './constants';

type Cell = {
    x: number;
    y: number;
};

export const $activeCell = atom<Cell>({
    x: 0,
    y: 0,
});

export const isCellVisible = ({
    cell,
    col,
    offset,
    row,
}: {
    cell: Cell;
    col: number;
    offset: number;
    row: number;
}) =>
    cell.x >= offset &&
    cell.x < offset + NUM &&
    cell.x % NUM === row &&
    cell.y === col;

export const move = (event: KeyboardEvent) => {
    const newCell = { ...$activeCell.get() };
    const STEP = 1;

    switch (event.key) {
        case 'ArrowUp':
            newCell.y = Math.max(0, newCell.y - STEP);
            break;
        case 'ArrowDown':
            newCell.y = Math.min(NUM - STEP, newCell.y + STEP);
            break;
        case 'ArrowLeft':
            newCell.x = Math.max(0, newCell.x - STEP);
            break;
        case 'ArrowRight':
            newCell.x = Math.min(NUM * BOARDS_NUM - STEP, newCell.x + STEP);
            break;
        default:
            return;
    }

    $activeCell.set(newCell);
    event.preventDefault();
};
