import { createBoard, generateBoard } from "./flood.js";

export const SPLASH_WIDTH = 4;
export const SPLASH_HEIGHT = 4;
export const SPLASH_COLOR_COUNT = 4;

const DESIGNED_BOARDS = Object.freeze([
  Object.freeze([
    0, 1, 2, 3,
    0, 1, 2, 3,
    1, 1, 2, 3,
    0, 3, 3, 3
  ]),
  Object.freeze([
    0, 0, 1, 1,
    2, 0, 1, 3,
    2, 2, 3, 3,
    0, 2, 1, 3
  ]),
  Object.freeze([
    0, 1, 2, 3,
    0, 0, 1, 2,
    3, 0, 0, 1,
    2, 3, 0, 0
  ])
]);

export function createSplashBoard({ round, seed }) {
  if (!Number.isInteger(round) || round < 1) throw new RangeError("round must be a positive integer");

  if (round <= DESIGNED_BOARDS.length) {
    return createBoard({
      width: SPLASH_WIDTH,
      height: SPLASH_HEIGHT,
      colorCount: SPLASH_COLOR_COUNT,
      cells: DESIGNED_BOARDS[round - 1]
    });
  }

  return generateBoard({
    width: SPLASH_WIDTH,
    height: SPLASH_HEIGHT,
    colorCount: SPLASH_COLOR_COUNT,
    seed
  });
}

