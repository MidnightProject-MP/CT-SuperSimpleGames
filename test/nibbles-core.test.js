import test from "node:test";
import assert from "node:assert/strict";
import { addItem, createNibblesState, NIBBLES_CAP, removeItem, toneFor } from "../src/nibbles-core.js";

test("the pile starts empty and grows one berry at a time", () => {
  let state = createNibblesState();
  assert.equal(state.count, 0);

  for (const expected of [1, 2, 3]) {
    const next = addItem(state);
    assert.equal(next.count, expected);
    assert.equal(next.event, "arrived");
    state = next;
  }
});

test("the cap celebrates instead of growing: five is satisfyingly full", () => {
  let state = createNibblesState();
  while (state.count < NIBBLES_CAP) state = addItem(state);

  assert.equal(state.count, NIBBLES_CAP);
  assert.equal(addItem(state), null);
});

test("removing releases items one at a time and stops at zero", () => {
  let state = createNibblesState();
  for (let i = 0; i < 3; i += 1) state = addItem(state);

  const first = removeItem(state);
  assert.equal(first.count, 2);
  assert.equal(first.event, "released");

  state = removeItem(first);
  state = removeItem(state);
  assert.equal(removeItem(state), null);
});

test("add and remove round-trips preserve the exact count", () => {
  let state = createNibblesState();
  state = addItem(state);
  state = addItem(state);
  state = addItem(state);
  assert.equal(state.count, 3);
  state = removeItem(state);
  assert.equal(state.count, 2);
  state = addItem(state);
  assert.equal(state.count, 3);
});

test("each quantity has a distinct audible step", () => {
  const tones = [];
  for (let count = 1; count <= NIBBLES_CAP; count += 1) tones.push(toneFor(count));
  assert.equal(new Set(tones).size, NIBBLES_CAP);
  assert.ok(tones.every((tone) => Number.isFinite(tone) && tone > 0));
  assert.throws(() => toneFor(0));
  assert.throws(() => toneFor(6));
  assert.throws(() => toneFor(2.5));
});
