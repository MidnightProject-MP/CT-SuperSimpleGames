import test from "node:test";
import assert from "node:assert/strict";
import { createSplashBoard, SPLASH_COLOR_COUNT } from "../src/splash-boards.js";

test("the first three rounds use stable designed boards with every identity", () => {
  const boards = [1, 2, 3].map((round) => createSplashBoard({ round, seed: 99 }));
  assert.equal(new Set(boards.map((board) => Array.from(board.cells).join(","))).size, 3);
  for (const board of boards) {
    assert.deepEqual([...new Set(board.cells)].sort(), [0, 1, 2, 3]);
    assert.equal(board.colorCount, SPLASH_COLOR_COUNT);
  }
});

test("later rounds remain seed-deterministic and varied", () => {
  const first = createSplashBoard({ round: 4, seed: 123 });
  const repeat = createSplashBoard({ round: 4, seed: 123 });
  const other = createSplashBoard({ round: 5, seed: 456 });
  assert.deepEqual(first, repeat);
  assert.notDeepEqual(first.cells, other.cells);
});

test("invalid rounds are rejected", () => {
  assert.throws(() => createSplashBoard({ round: 0, seed: 1 }), RangeError);
});

