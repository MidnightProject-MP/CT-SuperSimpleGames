import test from "node:test";
import assert from "node:assert/strict";
import { nearestTargetIndex } from "../src/color-input.js";

const rects = [
  { left: 0, right: 40, top: 0, bottom: 40 },
  { left: 50, right: 90, top: 0, bottom: 40 },
  { left: 0, right: 40, top: 50, bottom: 90 },
  { left: 50, right: 90, top: 50, bottom: 90 }
];

test("points inside a target retain the literal target", () => {
  assert.equal(nearestTargetIndex({ x: 75, y: 20, rects }), 1);
  assert.equal(nearestTargetIndex({ x: 20, y: 75, rects }), 2);
});

test("dead space resolves to the nearest target", () => {
  assert.equal(nearestTargetIndex({ x: 44, y: 20, rects }), 0);
  assert.equal(nearestTargetIndex({ x: 47, y: 20, rects }), 1);
  assert.equal(nearestTargetIndex({ x: 20, y: 47, rects }), 2);
});

test("an exact gap tie resolves by center proximity and then stable order", () => {
  assert.equal(nearestTargetIndex({ x: 45, y: 10, rects }), 0);
  assert.equal(nearestTargetIndex({ x: 45, y: 45, rects }), 0);
});

test("invalid geometry is rejected", () => {
  assert.throws(() => nearestTargetIndex({ x: 1, y: 1, rects: [] }), RangeError);
  assert.throws(() => nearestTargetIndex({ x: NaN, y: 1, rects }), TypeError);
  assert.throws(() => nearestTargetIndex({
    x: 1,
    y: 1,
    rects: [{ left: 5, right: 1, top: 0, bottom: 2 }]
  }), RangeError);
});

