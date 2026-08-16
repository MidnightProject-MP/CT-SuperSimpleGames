import { createBoard, generateBoard } from "./flood.js";

export const SPLASH_COLOR_COUNT = 4;

export const SPLASH_FAMILIES = Object.freeze(["bridge", "islands", "stripes", "rings", "path", "pockets"]);

function definition(family, width, height, cells, label) {
  const colorCount = Math.max(...cells) + 1;
  return Object.freeze({ family, width, height, colorCount, cells: Object.freeze(cells), label });
}

export const DESIGNED_SPLASH_BOARDS = Object.freeze([
  definition("bridge", 2, 2, [0, 1, 1, 2], "A little bridge"),
  definition("islands", 2, 2, [0, 1, 2, 3], "Four little islands"),
  definition("stripes", 2, 2, [0, 1, 0, 1], "Two stripes"),
  definition("bridge", 4, 4, [
    0, 1, 2, 3,
    0, 1, 2, 3,
    1, 1, 2, 3,
    0, 3, 3, 3
  ], "A winding bridge"),
  definition("islands", 4, 4, [
    0, 0, 1, 1,
    2, 0, 1, 3,
    2, 2, 3, 3,
    0, 2, 1, 3
  ], "Color islands"),
  definition("stripes", 4, 4, [
    0, 1, 2, 3,
    0, 1, 2, 3,
    0, 1, 2, 3,
    0, 1, 2, 3
  ], "Long stripes"),
  definition("rings", 4, 4, [
    0, 1, 1, 1,
    2, 2, 3, 1,
    2, 3, 3, 1,
    2, 2, 2, 1
  ], "Around the ring"),
  definition("path", 4, 4, [
    0, 1, 2, 3,
    3, 2, 1, 0,
    0, 1, 2, 3,
    3, 2, 1, 0
  ], "A zigzag path"),
  definition("pockets", 4, 4, [
    0, 0, 1, 1,
    0, 2, 1, 3,
    2, 2, 3, 3,
    2, 1, 1, 3
  ], "Little pockets")
]);

export function validateSplashDefinition(value) {
  if (!value || !SPLASH_FAMILIES.includes(value.family)) throw new RangeError("board family is invalid");
  if (typeof value.label !== "string" || value.label.length === 0) throw new TypeError("board label is required");
  const board = createBoard(value);
  if (board.colorCount > SPLASH_COLOR_COUNT) throw new RangeError("designed boards use at most four identities");
  if (new Set(board.cells).size !== board.colorCount) {
    throw new RangeError("designed boards must expose every available identity");
  }
  return board;
}

export function createSplashBoard({ round, seed }) {
  if (!Number.isInteger(round) || round < 1) throw new RangeError("round must be a positive integer");

  if (round <= DESIGNED_SPLASH_BOARDS.length) {
    const selected = DESIGNED_SPLASH_BOARDS[round - 1];
    return { ...validateSplashDefinition(selected), family: selected.family, label: selected.label };
  }

  const board = generateBoard({
    width: 4,
    height: 4,
    colorCount: SPLASH_COLOR_COUNT,
    seed
  });
  return { ...board, family: "mixed", label: "A mixed-up garden" };
}
