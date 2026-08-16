import test from "node:test";
import assert from "node:assert/strict";
import {
  ITEM_CATALOG,
  PATTERN_CATALOG,
  POCKET_COUNT,
  createRound,
  greetingPair,
  togglePocket
} from "../src/pockets.js";

function snapshot(round) {
  return {
    seed: round.seed,
    itemIds: [...round.itemIds],
    patternIds: [...round.patternIds],
    open: [...round.open],
    discovered: [...round.discovered],
    complete: round.complete
  };
}

test("catalogs provide enough familiar, unique IDs", () => {
  assert.ok(ITEM_CATALOG.length >= POCKET_COUNT);
  assert.ok(PATTERN_CATALOG.length >= POCKET_COUNT);
  assert.equal(new Set(ITEM_CATALOG).size, ITEM_CATALOG.length);
  assert.equal(new Set(PATTERN_CATALOG).size, PATTERN_CATALOG.length);
  assert.equal(Object.isFrozen(ITEM_CATALOG), true);
  assert.equal(Object.isFrozen(PATTERN_CATALOG), true);
});

test("round generation is deterministic and varies across many explicit seeds", () => {
  const first = createRound({ seed: 42 });
  const again = createRound({ seed: 42 });
  assert.deepEqual(snapshot(first), snapshot(again));

  const signatures = new Set();
  for (let seed = 0; seed < 128; seed += 1) {
    const round = createRound({ seed });
    assert.equal(round.itemIds.length, POCKET_COUNT);
    assert.equal(round.patternIds.length, POCKET_COUNT);
    assert.equal(new Set(round.itemIds).size, POCKET_COUNT);
    assert.equal(new Set(round.patternIds).size, POCKET_COUNT);
    signatures.add(`${round.itemIds.join(",")}|${round.patternIds.join(",")}`);
  }
  assert.ok(signatures.size > 100, "many seeds should produce varied rounds");
});

test("round state is frozen and callers cannot mutate generated arrays", () => {
  const round = createRound(9);

  assert.equal(Object.isFrozen(round), true);
  assert.equal(Object.isFrozen(round.itemIds), true);
  assert.equal(Object.isFrozen(round.patternIds), true);
  assert.equal(Object.isFrozen(round.open), true);
  assert.equal(Object.isFrozen(round.discovered), true);
  assert.throws(() => { round.open[0] = true; }, TypeError);
  assert.throws(() => { round.itemIds[0] = "cat"; }, TypeError);
});

test("opening and closing are immutable and return announcement metadata", () => {
  const round = createRound({ seed: 7 });
  const before = snapshot(round);
  const opened = togglePocket(round, 1);

  assert.deepEqual(snapshot(round), before);
  assert.notEqual(opened.state, round);
  assert.deepEqual(opened.state.open, [false, true, false]);
  assert.deepEqual(opened.state.discovered, [false, true, false]);
  assert.equal(opened.index, 1);
  assert.equal(opened.itemId, round.itemIds[1]);
  assert.equal(opened.patternId, round.patternIds[1]);
  assert.equal(opened.open, true);
  assert.equal(opened.opened, true);
  assert.equal(opened.discoveredNow, true);
  assert.equal(opened.completedNow, false);
  assert.match(opened.announcement, /Pocket 2/);
  assert.match(opened.announcement, new RegExp(opened.itemId));

  const closed = togglePocket(opened.state, 1);
  assert.deepEqual(closed.state.open, [false, false, false]);
  assert.deepEqual(closed.state.discovered, [false, true, false]);
  assert.equal(closed.discovered, true);
  assert.equal(closed.discoveredNow, false);
  assert.equal(closed.action, "close");
  assert.match(closed.announcement, /closed/);
});

test("discovery is monotonic when a discovered pocket is reopened", () => {
  let round = createRound({ seed: 13 });
  round = togglePocket(round, 0).state;
  round = togglePocket(round, 0).state;
  const reopened = togglePocket(round, 0);

  assert.deepEqual(reopened.state.discovered, [true, false, false]);
  assert.equal(reopened.state.open[0], true);
  assert.equal(reopened.discoveredNow, false);
  assert.equal(reopened.state.complete, false);
});

test("completion is held after every pocket has been opened at least once", () => {
  let round = createRound({ seed: 22 });
  const first = togglePocket(round, 0);
  round = first.state;
  round = togglePocket(round, 1).state;
  const completed = togglePocket(round, 2);

  assert.equal(completed.complete, true);
  assert.equal(completed.completedNow, true);
  assert.equal(completed.state.complete, true);
  assert.deepEqual(completed.state.discovered, [true, true, true]);

  const closed = togglePocket(completed.state, 2);
  assert.equal(closed.state.complete, true);
  assert.equal(closed.completedNow, false);
  assert.deepEqual(closed.state.open, [true, true, false]);
  assert.deepEqual(closed.state.discovered, [true, true, true]);
});

test("greeting partners are deterministic and prefer the nearest open pocket", () => {
  let round = createRound({ seed: 25 });
  assert.equal(greetingPair(round, 0), null);
  round = togglePocket(round, 0).state;
  assert.equal(greetingPair(round, 0), null);
  round = togglePocket(round, 2).state;
  assert.deepEqual(greetingPair(round, 2), [2, 0]);
  round = togglePocket(round, 1).state;
  assert.deepEqual(greetingPair(round, 1), [1, 0]);
  assert.deepEqual(greetingPair(round, 2), [2, 1]);
});

test("closed and invalid pockets cannot receive a greeting partner", () => {
  const round = createRound({ seed: 26 });
  assert.equal(greetingPair(round, 1), null);
  assert.throws(() => greetingPair(round, 3), RangeError);
});

test("rapid toggles remain bounded to three valid flags", () => {
  let round = createRound({ seed: 31 });
  for (let move = 0; move < 10_000; move += 1) {
    round = togglePocket(round, move % POCKET_COUNT).state;
    assert.equal(round.open.length, POCKET_COUNT);
    assert.equal(round.discovered.length, POCKET_COUNT);
  }
  assert.equal(round.open.every((flag) => typeof flag === "boolean"), true);
  assert.equal(round.discovered.every((flag) => typeof flag === "boolean"), true);
  assert.equal(round.complete, round.discovered.every(Boolean));
});

test("typed-array source state is copied and never mutated", () => {
  const source = createRound({ seed: 55 });
  const open = Uint8Array.from([1, 0, 0]);
  const discovered = Uint8Array.from([1, 0, 0]);
  const state = {
    seed: source.seed,
    itemIds: [...source.itemIds],
    patternIds: [...source.patternIds],
    open,
    discovered,
    complete: false
  };
  const beforeOpen = [...open];
  const beforeDiscovered = [...discovered];

  const result = togglePocket(state, 1);

  assert.deepEqual([...open], beforeOpen);
  assert.deepEqual([...discovered], beforeDiscovered);
  assert.deepEqual(result.state.open, [true, true, false]);
  assert.deepEqual(result.state.discovered, [true, true, false]);
});

test("invalid seeds are rejected", () => {
  for (const input of [undefined, null, {}, { seed: "1" }, { seed: 1.5 }, { seed: -1 },
    { seed: 0x1_0000_0000 }, { seed: Number.NaN }, { seed: Number.POSITIVE_INFINITY }]) {
    assert.throws(() => createRound(input), /seed|explicit/i);
  }
});

test("invalid state shapes, flags, and indices are rejected", () => {
  const round = createRound({ seed: 64 });
  const malformed = [
    { ...round, open: [false, false] },
    { ...round, discovered: [false, false, 2] },
    { ...round, open: [true, false, false], discovered: [false, false, false] },
    { ...round, complete: true },
    { ...round, itemIds: [round.itemIds[0], round.itemIds[0], round.itemIds[2]] },
    { ...round, patternIds: ["not-a-pattern", ...round.patternIds.slice(1)] }
  ];

  for (const state of malformed) assert.throws(() => togglePocket(state, 0));
  for (const index of [-1, 3, 1.5, Number.NaN, "1", null]) {
    assert.throws(() => togglePocket(round, index), RangeError);
  }
  assert.throws(() => togglePocket(null, 0), TypeError);
});
