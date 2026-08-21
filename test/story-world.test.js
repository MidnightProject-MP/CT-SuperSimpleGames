import test from "node:test";
import assert from "node:assert/strict";
import { createSceneState, placeSceneObject, restoreSceneState, serializeSceneState } from "../src/story-scene.js";
import { restoreStoryWorld, serializeStoryWorld } from "../src/story-world.js";

test("a story world round-trips every parked scene and its active scene", () => {
  const garden = placeSceneObject(createSceneState("garden"), { x: 0.5, y: 0.5 }, { width: 390, height: 844 });
  const town = createSceneState("town");
  const world = serializeStoryWorld("garden", { garden: garden.state, town });
  const restored = restoreStoryWorld(JSON.parse(JSON.stringify(world)));
  assert.equal(restored.active, "garden");
  assert.equal(restored.scenes.garden.objects.length, 1);
  assert.equal(restored.scenes.town.sceneId, "town");
});

test("legacy single-scene snapshots become the active slot", () => {
  const legacy = serializeSceneState(createSceneState("castle"));
  const restored = restoreStoryWorld(JSON.parse(JSON.stringify(legacy)));
  assert.equal(restored.active, "castle");
  assert.deepEqual(Object.keys(restored.scenes), ["castle"]);
});

test("story world serialization rejects unknown scenes and a missing active slot", () => {
  const state = createSceneState();
  assert.throws(() => serializeStoryWorld("neverland", { neverland: state }), RangeError);
  assert.throws(() => serializeStoryWorld("garden", {}), TypeError);
});

test("story world restoration validates ids, slots, and corruption", () => {
  const good = restoreSceneState(serializeSceneState(createSceneState()));
  assert.throws(() => restoreStoryWorld(null), TypeError);
  assert.throws(() => restoreStoryWorld({ active: "garden", scenes: {} }), RangeError);
  assert.throws(() => restoreStoryWorld({ active: "garden", scenes: { neverland: good } }), RangeError);
  assert.throws(() => restoreStoryWorld({ active: "mystery", scenes: { garden: good } }), RangeError);
  assert.throws(() => restoreStoryWorld({ active: "town", scenes: { garden: good } }), RangeError);
  assert.throws(() => restoreStoryWorld({ active: "garden", scenes: { garden: { broken: true } } }), TypeError);
});
