import test from "node:test";
import assert from "node:assert/strict";
import { floodFill, isSolved } from "../src/flood.js";
import { createSplashBoard, DESIGNED_SPLASH_BOARDS, SPLASH_COLOR_COUNT, SPLASH_FAMILIES, validateSplashDefinition } from "../src/splash-boards.js";

const TEACHING_ROUND_COUNT = DESIGNED_SPLASH_BOARDS.filter((board) => board.cells.length === 4).length;

function solveBoard(board) {
  let current = board;
  for (let moves = 0; !isSolved(current); moves += 1) {
    assert.ok(moves < board.cells.length, "board solves within one flood per cell");
    let best = null;
    for (const color of new Set(current.cells)) {
      if (color === current.cells[0]) continue;
      const attempt = floodFill(current, color);
      if (!best || attempt.captured.length > best.captured.length) best = attempt;
    }
    current = best.board;
  }
}

test("designed rounds progress from four-cell teaching boards into every puzzle family", () => {
  const boards = DESIGNED_SPLASH_BOARDS.map((_, index) => createSplashBoard({ round: index + 1, seed: 99 }));
  assert.equal(new Set(boards.map((board) => Array.from(board.cells).join(","))).size, boards.length);
  assert.deepEqual(boards.slice(0, 3).map((board) => board.cells.length), [4, 4, 4]);
  assert.deepEqual([...new Set(boards.slice(3).map((board) => board.family))].sort(), [...SPLASH_FAMILIES].sort());
  for (const board of boards) {
    assert.deepEqual([...new Set(board.cells)].sort(), [...Array(board.colorCount).keys()]);
    assert.ok(board.colorCount >= 2 && board.colorCount <= SPLASH_COLOR_COUNT);
  }
});

test("later rounds remain seed-deterministic and varied", () => {
  const laterRound = DESIGNED_SPLASH_BOARDS.length + 1;
  const first = createSplashBoard({ round: laterRound, seed: 123 });
  const repeat = createSplashBoard({ round: laterRound, seed: 123 });
  const other = createSplashBoard({ round: laterRound + 1, seed: 456 });
  assert.deepEqual(first, repeat);
  assert.notDeepEqual(first.cells, other.cells);
});

test("declarative board definitions reject missing identities and unknown families", () => {
  assert.throws(() => validateSplashDefinition({ family: "maze", label: "Maze", width: 2, height: 2, colorCount: 4, cells: [0, 1, 2, 3] }), RangeError);
  assert.throws(() => validateSplashDefinition({ family: "bridge", label: "Bridge", width: 2, height: 2, colorCount: 4, cells: [0, 1, 1, 2] }), RangeError);
});

test("invalid rounds are rejected", () => {
  assert.throws(() => createSplashBoard({ round: 0, seed: 1 }), RangeError);
});

test("teaching rounds stay identical under a reduced identity count", () => {
  for (let round = 1; round <= TEACHING_ROUND_COUNT; round += 1) {
    assert.deepEqual(
      createSplashBoard({ round, seed: round * 11, colorCount: 3 }),
      createSplashBoard({ round, seed: round * 11 })
    );
  }
});

test("reduced identity counts yield valid, fully-exposed, solvable boards", () => {
  const lastRound = DESIGNED_SPLASH_BOARDS.length + 6;
  for (let round = TEACHING_ROUND_COUNT + 1; round <= lastRound; round += 1) {
    const board = createSplashBoard({ round, seed: round * 13, colorCount: 3 });
    assert.equal(board.colorCount, 3);
    assert.deepEqual([...new Set(board.cells)].sort(), [0, 1, 2]);
    solveBoard(board);
  }
});

test("identity counts outside the supported range are rejected", () => {
  assert.throws(() => createSplashBoard({ round: 12, seed: 1, colorCount: SPLASH_COLOR_COUNT + 1 }), RangeError);
  assert.throws(() => createSplashBoard({ round: 12, seed: 1, colorCount: 1 }), RangeError);
});
