import { useStore } from '@nanostores/react';

import * as cn from './board.css';
import { BOARD } from './constants';
import { $activeCell, isCellVisible } from './store';

const Board = ({ offset }: { offset: number }) => {
    const cell = useStore($activeCell);

    return (
        <div className={cn.container}>
            <span className={cn.title} style={{ color: '#58C4DC' }}>
                React
            </span>
            <div className={cn.board}>
                {BOARD.map((column, index) => (
                    <div className={cn.column} key={column[index][0]}>
                        {column.map(([col, row]) => (
                            <div className={cn.cell} key={col + row}>
                                {isCellVisible({ cell, col, offset, row }) && (
                                    <svg width="100%" height="100%">
                                        <circle
                                            fill="red"
                                            cy="50%"
                                            cx="50%"
                                            r="5"
                                        />
                                    </svg>
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Board;
