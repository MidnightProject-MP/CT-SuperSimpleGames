import test from "node:test";
import assert from "node:assert/strict";
import { createBoard, floodFill, floodRegion, generateBoard, isSolved } from "../src/flood.js";

function board(cells, width = 3, colorCount = 4) {
  return createBoard({ width, height: cells.length / width, colorCount, cells });
}

test("floodRegion uses four-neighbor connectivity from the top-left", () => {
  const current = board([
    0, 0, 1,
    0, 1, 0,
    1, 0, 0
  ]);

  assert.deepEqual(floodRegion(current), [0, 1, 3]);
});

test("floodFill changes only the original anchor region and absorbs its new neighbors", () => {
  const current = board([
    0, 0, 1,
    0, 1, 2,
    3, 2, 2
  ]);
  const result = floodFill(current, 1);

  assert.deepEqual([...result.board.cells], [1, 1, 1, 1, 1, 2, 3, 2, 2]);
  assert.deepEqual(result.changed, [0, 1, 3]);
  assert.deepEqual(result.captured, [0, 1, 2, 3, 4]);
  assert.equal(result.moved, true);
  assert.deepEqual([...current.cells], [0, 0, 1, 0, 1, 2, 3, 2, 2]);
});

test("choosing the anchor color is a safe immutable no-op", () => {
  const current = board([0, 0, 1, 0, 1, 2, 3, 2, 2]);
  const result = floodFill(current, 0);

  assert.equal(result.moved, false);
  assert.deepEqual(result.changed, []);
  assert.notEqual(result.board.cells, current.cells);
  assert.deepEqual([...result.board.cells], [...current.cells]);
});

test("solved state handles single-cell, uniform, and mixed boards", () => {
  assert.equal(isSolved(createBoard({ width: 1, height: 1, colorCount: 1, cells: [0] })), true);
  assert.equal(isSolved(board([2, 2, 2, 2], 2)), true);
  assert.equal(isSolved(board([2, 2, 1, 2], 2)), false);
});

test("generation is deterministic, varied, and within bounds", () => {
  const first = generateBoard({ width: 5, height: 5, colorCount: 4, seed: 42 });
  const again = generateBoard({ width: 5, height: 5, colorCount: 4, seed: 42 });
  const other = generateBoard({ width: 5, height: 5, colorCount: 4, seed: 43 });

  assert.deepEqual([...first.cells], [...again.cells]);
  assert.notDeepEqual([...first.cells], [...other.cells]);
  assert.deepEqual(new Set(first.cells), new Set([0, 1, 2, 3]));
  assert.equal([...first.cells].every((color) => color >= 0 && color < 4), true);
});

test("frontier-color choices can solve many generated boards without shrinking", () => {
  for (let seed = 1; seed <= 40; seed += 1) {
    let current = generateBoard({ width: 5, height: 5, colorCount: 4, seed });
    let previousSize = floodRegion(current).length;

    for (let moves = 0; moves < current.cells.length - 1 && !isSolved(current); moves += 1) {
      const region = new Set(floodRegion(current));
      let target;
      for (const index of region) {
        const x = index % current.width;
        const y = Math.floor(index / current.width);
        const neighbors = [
          x > 0 ? index - 1 : -1,
          x + 1 < current.width ? index + 1 : -1,
          y > 0 ? index - current.width : -1,
          y + 1 < current.height ? index + current.width : -1
        ];
        const boundary = neighbors.find((neighbor) => neighbor >= 0 && !region.has(neighbor));
        if (boundary !== undefined) {
          target = current.cells[boundary];
          break;
        }
      }

      const result = floodFill(current, target);
      assert.ok(result.captured.length > previousSize);
      previousSize = result.captured.length;
      current = result.board;
    }

    assert.equal(isSolved(current), true, `seed ${seed} did not solve`);
  }
});

test("arbitrary valid choices never shrink the anchored region", () => {
  for (let seed = 1; seed <= 30; seed += 1) {
    let current = generateBoard({ width: 5, height: 5, colorCount: 4, seed });
    for (let move = 0; move < 20; move += 1) {
      const before = [...current.cells];
      const previousSize = floodRegion(current).length;
      const result = floodFill(current, (seed + move) % current.colorCount);
      assert.ok(result.captured.length >= previousSize);
      assert.deepEqual([...current.cells], before);
      current = result.board;
    }
  }
});

test("invalid boards and target colors are rejected", () => {
  assert.throws(() => createBoard({ width: 0, height: 2, colorCount: 2, cells: [] }), RangeError);
  assert.throws(() => createBoard({ width: 2, height: 2, colorCount: 2, cells: [0, 1] }), RangeError);
  assert.throws(() => createBoard({ width: 2, height: 2, colorCount: 2, cells: [0, 1, 2, 0] }), RangeError);
  assert.throws(() => createBoard({ width: 2, height: 2, colorCount: 2, cells: [0, 1, 0.5, 0] }), RangeError);
  assert.throws(() => floodFill(board([0, 1, 1, 0], 2, 2), 2), RangeError);
});
