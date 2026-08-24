import test from "node:test";
import assert from "node:assert/strict";
import { computeWindDown } from "../src/wind-down.js";

const START = 1_000_000_000;

test("stays in play without a valid session length or start time", () => {
  const base = { startedAt: START, minutes: 10, now: START };

  assert.equal(computeWindDown({}), "play");
  assert.equal(computeWindDown({ startedAt: START, minutes: null }), "play");
  assert.equal(computeWindDown({ ...base, minutes: undefined }), "play");
  assert.equal(computeWindDown({ ...base, minutes: 0 }), "play");
  assert.equal(computeWindDown({ ...base, minutes: NaN }), "play");
  assert.equal(computeWindDown({ ...base, minutes: -30 }), "play");
  assert.equal(computeWindDown({ minutes: 10 }), "play");
  assert.equal(computeWindDown({ ...base, startedAt: NaN }), "play");
});

test("evening begins exactly in the final two minutes", () => {
  const duration = 10 * 60000;

  assert.equal(computeWindDown({ startedAt: START, minutes: 10, now: START + duration - 120001 }), "play");
  assert.equal(computeWindDown({ startedAt: START, minutes: 10, now: START + duration - 120000 }), "evening");
  assert.equal(computeWindDown({ startedAt: START, minutes: 10, now: START + duration - 1 }), "evening");
});

test("rest arrives once the session has fully elapsed", () => {
  const duration = 10 * 60000;

  assert.equal(computeWindDown({ startedAt: START, minutes: 10, now: START + duration }), "rest");
  assert.equal(computeWindDown({ startedAt: START, minutes: 10, now: START + duration + 60000 }), "rest");
});

test("a clock running behind the session start stays in play", () => {
  const anomaly = { startedAt: START + 120000, minutes: 10 };

  assert.equal(computeWindDown({ ...anomaly, now: START + 59999 }), "play");
});
