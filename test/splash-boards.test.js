import test from "node:test";
import assert from "node:assert/strict";
import { createSplashBoard, DESIGNED_SPLASH_BOARDS, SPLASH_COLOR_COUNT, SPLASH_FAMILIES, validateSplashDefinition } from "../src/splash-boards.js";

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
