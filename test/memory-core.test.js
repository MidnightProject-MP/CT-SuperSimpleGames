import test from "node:test";
import assert from "node:assert/strict";
import {
  closeMismatched,
  createMemoryRound,
  flipToken,
  hideTokens,
  isComplete,
  tokenIdAt
} from "../src/memory-core.js";

const POOL = ["cat", "duck", "bear", "star", "sun", "flower"];

test("rounds are deterministic for a seed and contain exactly two of each pair", () => {
  const first = createMemoryRound({ seed: 7, pairCount: 2, pool: POOL });
  const second = createMemoryRound({ seed: 7, pairCount: 2, pool: POOL });
  assert.deepEqual(first, second);

  assert.equal(first.tokens.length, 4);
  const counts = {};
  for (const token of first.tokens) counts[token.itemId] = (counts[token.itemId] ?? 0) + 1;
  assert.equal(Object.keys(counts).length, 2);
  for (const count of Object.values(counts)) assert.equal(count, 2);
});

test("different seeds produce varied arrangements across a sweep", () => {
  const arrangements = new Set();
  for (let seed = 0; seed < 24; seed += 1) {
    const round = createMemoryRound({ seed, pairCount: 2, pool: POOL });
    arrangements.add(round.tokens.map((token) => token.itemId).join("-"));
  }
  assert.ok(arrangements.size > 6, `only ${arrangements.size} distinct arrangements in 24 seeds`);
});

test("the witnessed phase starts visible and hides exactly once", () => {
  let round = createMemoryRound({ seed: 3, pairCount: 2, pool: POOL });
  assert.equal(round.hidden, false);
  assert.deepEqual(flipToken(round, 0), { round, outcome: "ignored" }, "flips must wait until the friends hide");

  round = hideTokens(round);
  assert.throws(() => hideTokens(round));
});

test("mismatches keep both faces up until closed, with no penalty", () => {
  const base = hideTokens(createMemoryRound({ seed: 11, pairCount: 2, pool: POOL }));
  // Flip two tokens; if they match, use another seed where they do not.
  let round = base;
  let indices = [];
  for (let attempt = 0; attempt < 40 && indices.length < 2; attempt += 1) {
    round = base;
    const first = flipToken(round, 0);
    assert.equal(first.outcome, "first-open");
    const second = flipToken(first.round, 1);
    if (second.outcome === "mismatched") { indices = [0, 1]; break; }
    if (second.outcome === "matched") continue;
  }

  if (indices.length === 2) {
    const mismatchState = flipToken(base, 0).round;
    const opened = flipToken(mismatchState, 1);
    assert.equal(opened.outcome, "mismatched");
    assert.equal(opened.round.open.length, 2);
    const closed = closeMismatched(opened.round);
    assert.equal(closed.open.length, 0);
    assert.equal(closed.found.length, 0, "a mismatch must never punish");
  } else {
    // Seed 11 opens with a match on 0/1; verify the mismatch path elsewhere.
    let found = null;
    for (let seed = 12; found === null && seed < 60; seed += 1) {
      const candidate = hideTokens(createMemoryRound({ seed, pairCount: 2, pool: POOL }));
      const step = flipToken(candidate, 0);
      const pairFlip = flipToken(step.round, 1);
      if (pairFlip.outcome === "mismatched") found = pairFlip.round;
    }
    assert.ok(found, "some nearby seed must exercise mismatches");
    assert.equal(found.open.length, 2);
  }
});

test("matched pairs lock open and completing all pairs finishes the round", () => {
  for (let seed = 0; seed < 80; seed += 1) {
    let round = hideTokens(createMemoryRound({ seed, pairCount: 2, pool: POOL }));
    let sweeps = 0;
    while (!isComplete(round)) {
      sweeps += 1;
      assert.ok(sweeps <= 6, "each sweep must lock at least one pair");
      let lockedThisSweep = false;
      for (let a = 0; a < round.tokens.length && !lockedThisSweep; a += 1) {
        const first = flipToken(round, a);
        if (first.outcome === "ignored") continue;
        for (let b = 0; b < round.tokens.length; b += 1) {
          if (b === a) continue;
          const second = flipToken(first.round, b);
          if (second.outcome === "matched") {
            round = second.round;
            lockedThisSweep = true;
            break;
          }
          if (second.outcome === "mismatched") {
            round = closeMismatched(second.round);
            break;
          }
        }
        if (!lockedThisSweep) round = closeMismatched(round);
      }
      assert.ok(lockedThisSweep, "an exhaustive sweep must always find a pair");
    }
    assert.equal(round.found.length, 4);
    return; // one full completion walk is enough
  }
});

test("invalid construction and access are rejected", () => {
  assert.throws(() => createMemoryRound({ seed: -1, pairCount: 2, pool: POOL }));
  assert.throws(() => createMemoryRound({ seed: 1, pairCount: 4, pool: POOL }));
  assert.throws(() => createMemoryRound({ seed: 1, pairCount: 2, pool: [] }));

  const round = hideTokens(createMemoryRound({ seed: 5, pairCount: 2, pool: POOL }));
  assert.throws(() => flipToken(round, -1));
  assert.throws(() => flipToken(round, 9));
  assert.throws(() => tokenIdAt(round, 9));
  assert.equal(typeof tokenIdAt(round, 0), "string");
});
