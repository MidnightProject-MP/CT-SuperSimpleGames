import test from "node:test";
import assert from "node:assert/strict";
import {
  LEVEL_COUNT,
  TONE_VOICES,
  TRAIL_LIMIT,
  activateVoice,
  createToneState,
  motifForTrail,
  reactivateTrail,
} from "../src/together-tone.js";

test("together tones starts silent, bounded, and immutable", () => {
  const state = createToneState();
  assert.deepEqual(Object.keys(state.levels), TONE_VOICES);
  assert.equal(Object.values(state.levels).every((level) => level === 0), true);
  assert.deepEqual(state.trail, []);
  assert.equal(state.pair, null);
  assert.equal(state.motif, null);
  assert.equal(Object.isFrozen(state), true);
  assert.equal(Object.isFrozen(state.levels), true);
  assert.equal(Object.isFrozen(state.trail), true);
});

test("recent sequences produce stable visual motifs without goals", () => {
  assert.equal(motifForTrail(["berry", "berry"]), "repetition");
  assert.equal(motifForTrail(["berry", "sunny", "berry"]), "alternation");
  assert.equal(motifForTrail(["berry", "sunny", "sky"]), "triangle");
  assert.equal(motifForTrail(["berry", "sunny", "sky", "leaf"]), "loop");
  assert.equal(motifForTrail(["berry"]), null);
});

test("the first voice says hello without inventing a partner", () => {
  const result = activateVoice(createToneState(), "berry");
  assert.equal(result.mode, "hello");
  assert.equal(result.previous, null);
  assert.equal(result.state.pair, null);
  assert.deepEqual(result.state.trail, ["berry"]);
});

test("repeating one voice creates a visible echo rather than a pair", () => {
  let state = activateVoice(createToneState(), "sky").state;
  const echo = activateVoice(state, "sky");
  assert.equal(echo.mode, "echo");
  assert.equal(echo.previous, "sky");
  assert.equal(echo.state.pair, null);
  assert.deepEqual(echo.state.trail, ["sky", "sky"]);
});

test("alternating voices creates an ordered cooperative pair", () => {
  let state = activateVoice(createToneState(), "leaf").state;
  const together = activateVoice(state, "sunny");
  assert.equal(together.mode, "together");
  assert.deepEqual(together.state.pair, ["leaf", "sunny"]);
  assert.deepEqual(together.state.trail, ["leaf", "sunny"]);
});

test("the recent trail retains only four actions", () => {
  let state = createToneState();
  for (const id of ["berry", "sunny", "sky", "leaf", "berry", "sky"]) {
    state = activateVoice(state, id).state;
  }
  assert.equal(state.trail.length, TRAIL_LIMIT);
  assert.deepEqual(state.trail, ["sky", "leaf", "berry", "sky"]);
});

test("touching a recent bead reactivates it once as the newest action", () => {
  let state = createToneState();
  for (const id of ["berry", "sunny", "sky"]) state = activateVoice(state, id).state;
  const replayed = reactivateTrail(state, 0);
  assert.equal(replayed.id, "berry");
  assert.equal(replayed.fromHistory, true);
  assert.equal(replayed.originalIndex, 0);
  assert.deepEqual(replayed.state.trail, ["berry", "sunny", "sky", "berry"]);
  assert.deepEqual(state.trail, ["berry", "sunny", "sky"]);
});

test("recent bead reactivation rejects missing positions", () => {
  const state = activateVoice(createToneState(), "leaf").state;
  assert.throws(() => reactivateTrail(state, -1), RangeError);
  assert.throws(() => reactivateTrail(state, 1), RangeError);
  assert.throws(() => reactivateTrail(state, 0.5), RangeError);
});

test("voice levels cycle without accumulating unbounded state", () => {
  let state = createToneState();
  for (let index = 0; index < LEVEL_COUNT + 2; index += 1) state = activateVoice(state, "berry").state;
  assert.equal(state.levels.berry, 2);
  assert.equal(state.trail.length, TRAIL_LIMIT);
});

test("prior states remain unchanged", () => {
  const initial = createToneState();
  activateVoice(initial, "sunny");
  assert.equal(initial.levels.sunny, 0);
  assert.deepEqual(initial.trail, []);
});

test("unknown voices and malformed state are rejected", () => {
  const state = createToneState();
  assert.throws(() => activateVoice(state, "missing"), RangeError);
  assert.throws(() => activateVoice({ levels: {}, trail: [], pair: null }, "berry"), RangeError);
  assert.throws(() => activateVoice({ ...state, pair: ["berry", "berry"] }, "berry"), RangeError);
  assert.throws(() => activateVoice({ ...state, trail: ["berry", "sky"], pair: ["sky", "berry"] }, "berry"), RangeError);
});
