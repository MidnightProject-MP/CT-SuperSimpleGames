import test from "node:test";
import assert from "node:assert/strict";
import { STORY_PACKS, getStoryPack, storyCastItem, storyRelationship, validateStoryPack } from "../src/story-packs.js";

test("all scene packs have complete local presentation and deterministic relationships", () => {
  assert.deepEqual(STORY_PACKS.map(({ id }) => id), ["garden", "town", "castle"]);
  for (const pack of STORY_PACKS) {
    assert.equal(validateStoryPack(pack), pack);
    for (const item of pack.cast) assert.equal(storyCastItem(pack, item.kind), item);
    for (const relation of pack.relationships) {
      assert.equal(storyRelationship(pack, ...relation.pair), relation);
      assert.equal(storyRelationship(pack, ...[...relation.pair].reverse()), relation);
    }
  }
  assert.throws(() => getStoryPack("missing"), RangeError);
});
