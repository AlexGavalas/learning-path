export const NUM = 5;
export const BOARDS_NUM = 2;
export const WIDTH = NUM;
export const HEIGHT = NUM;

export const BOARD = Array.from({ length: HEIGHT }, (_, row) =>
    Array.from({ length: WIDTH }, (__, col) => [col, row]),
);

export const OFFSETS = Array.from(
    { length: BOARDS_NUM },
    (_, index) => NUM * index,
);
