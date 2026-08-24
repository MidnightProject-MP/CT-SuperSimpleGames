import test from "node:test";
import assert from "node:assert/strict";
import { RESIDENT_TOUCHES, colorSplashResidentFor, storyResidentFor } from "../src/residents.js";

test("residents offer a bounded touch budget of three", () => {
  assert.equal(RESIDENT_TOUCHES, 3);
});

test("a butterfly arrives for every completed Color Splash board shape", () => {
  assert.deepEqual(colorSplashResidentFor({ completed: true }), { type: "butterfly", touches: RESIDENT_TOUCHES });
  assert.deepEqual(colorSplashResidentFor({ isComplete: true }), { type: "butterfly", touches: RESIDENT_TOUCHES });
  assert.deepEqual(colorSplashResidentFor({ completed: true, isComplete: true }), { type: "butterfly", touches: RESIDENT_TOUCHES });
  const board = { width: 4, height: 4, cells: [0, 1, 1, 2], completed: "yes" };
  assert.deepEqual(colorSplashResidentFor(board), { type: "butterfly", touches: RESIDENT_TOUCHES });
});

test("no butterfly arrives while a board is unfinished or missing", () => {
  assert.equal(colorSplashResidentFor({ completed: false, isComplete: false }), null);
  assert.equal(colorSplashResidentFor({}), null);
  assert.equal(colorSplashResidentFor(null), null);
  assert.equal(colorSplashResidentFor(undefined), null);
});

test("a snail slides in once the garden holds three objects", () => {
  assert.deepEqual(storyResidentFor({ scene: "garden", objectCount: 3 }), { type: "snail", touches: RESIDENT_TOUCHES });
  assert.deepEqual(storyResidentFor({ scene: "garden", objectCount: 7 }), { type: "snail", touches: RESIDENT_TOUCHES });
});

test("the snail stays home below three objects or outside the garden", () => {
  assert.equal(storyResidentFor({ scene: "garden", objectCount: 2 }), null);
  assert.equal(storyResidentFor({ scene: "garden", objectCount: 0 }), null);
  assert.equal(storyResidentFor({ scene: "town", objectCount: 5 }), null);
  assert.equal(storyResidentFor({ scene: "castle", objectCount: 4 }), null);
  assert.equal(storyResidentFor({}), null);
});
