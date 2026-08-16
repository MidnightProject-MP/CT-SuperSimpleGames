import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { STORY_PACKS, getStoryPack, storyCastItem, storyRelationship, validateStoryPack } from "../src/story-packs.js";

const storyUiSource = readFileSync(new URL("../src/story-scenes.js", import.meta.url), "utf8");
const storyStyles = readFileSync(new URL("../story-scenes.css", import.meta.url), "utf8");

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

test("every selectable story ingredient has a local palette and CSS-drawn art", () => {
  for (const { cast } of STORY_PACKS) {
    for (const { kind } of cast) {
      assert.match(storyUiSource, new RegExp(`\\b${kind}: Object\\.freeze`));
      assert.ok(storyStyles.includes(`.${kind}-art`), `${kind} needs local CSS art`);
    }
  }
});
