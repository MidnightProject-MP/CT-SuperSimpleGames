import test from "node:test";
import assert from "node:assert/strict";
import {
  createSearchRound,
  getPocketContentId,
  getSearchClue,
  getTargetItemId,
  searchGreetingPair,
  toggleSearchPocket
} from "../src/peekaboo-search.js";

test("search rounds deterministically choose one empty and one non-empty target pocket", () => {
  for (let seed = 0; seed < 100; seed += 1) {
    const first = createSearchRound({ seed });
    const again = createSearchRound({ seed });
    assert.deepEqual(first, again);
    assert.notEqual(first.emptyIndex, first.targetIndex);
    assert.equal(getPocketContentId(first, first.emptyIndex), null);
    assert.equal(getTargetItemId(first), first.pockets.itemIds[first.targetIndex]);
    assert.equal(first.targetFound, false);
  }
});

test("opening a clue remains a discovery but never finds or moves the target", () => {
  const round = createSearchRound({ seed: 17 });
  const result = toggleSearchPocket(round, round.emptyIndex);
  assert.equal(result.open, true);
  assert.equal(result.empty, true);
  assert.equal(result.contentId, null);
  assert.equal(result.foundNow, false);
  assert.equal(result.targetFound, false);
  assert.equal(result.state.targetIndex, round.targetIndex);
  assert.equal(result.state.emptyIndex, round.emptyIndex);
});

test("the clue stably matches the target home and points from its own location", () => {
  let round = createSearchRound({ seed: 18 });
  const clue = getSearchClue(round);
  assert.equal(clue.fromIndex, round.emptyIndex);
  assert.equal(clue.targetIndex, round.targetIndex);
  assert.equal(clue.patternId, round.pockets.patternIds[round.targetIndex]);
  assert.equal(clue.direction, round.targetIndex < round.emptyIndex ? "left" : "right");
  round = toggleSearchPocket(round, round.emptyIndex).state;
  round = toggleSearchPocket(round, round.targetIndex).state;
  assert.deepEqual(getSearchClue(round), clue);
});

test("target discovery is monotonic and does not end pocket interaction", () => {
  let round = createSearchRound({ seed: 23 });
  const found = toggleSearchPocket(round, round.targetIndex);
  assert.equal(found.foundNow, true);
  assert.equal(found.targetFound, true);
  assert.equal(found.complete, false);
  round = found.state;

  const closed = toggleSearchPocket(round, round.targetIndex);
  assert.equal(closed.foundNow, false);
  assert.equal(closed.targetFound, true);
  round = closed.state;

  const reopened = toggleSearchPocket(round, round.targetIndex);
  assert.equal(reopened.foundNow, false);
  assert.equal(reopened.targetFound, true);
});

test("greetings include only open non-empty friends", () => {
  let round = createSearchRound({ seed: 31 });
  const friendIndices = [0, 1, 2].filter((index) => index !== round.emptyIndex);
  round = toggleSearchPocket(round, friendIndices[0]).state;
  assert.equal(searchGreetingPair(round, friendIndices[0]), null);
  round = toggleSearchPocket(round, round.emptyIndex).state;
  assert.equal(searchGreetingPair(round, friendIndices[0]), null);
  round = toggleSearchPocket(round, friendIndices[1]).state;
  assert.deepEqual(searchGreetingPair(round, friendIndices[1]), [friendIndices[1], friendIndices[0]]);
});

test("invalid search inputs are rejected", () => {
  const round = createSearchRound({ seed: 42 });
  assert.throws(() => getPocketContentId(round, 3), RangeError);
  assert.throws(() => toggleSearchPocket(null, 0), TypeError);
  assert.throws(() => toggleSearchPocket({ ...round, targetIndex: round.emptyIndex }, 0), RangeError);
});
