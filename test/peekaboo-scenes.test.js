import test from "node:test";
import assert from "node:assert/strict";
import { PEEKABOO_SCENES, getPeekabooScene, peekabooSceneForSeed, validatePeekabooScene } from "../src/peekaboo-scenes.js";
import { createSearchRound, getPocketContentId, getSearchScene } from "../src/peekaboo-search.js";

test("four coherent local scenes define containers, content, and bounded behavior", () => {
  assert.deepEqual(PEEKABOO_SCENES.map((scene) => scene.id), ["animals", "vehicles", "weather", "sea"]);
  for (const scene of PEEKABOO_SCENES) {
    assert.equal(validatePeekabooScene(scene), scene);
    assert.ok(scene.itemIds.length >= 3);
    assert.equal(scene.emergence, "rise");
    assert.equal(scene.relationship, "greet");
  }
});

test("search generation stays inside its deterministic scene without moving the answer", () => {
  for (let seed = 0; seed < 64; seed += 1) {
    const round = createSearchRound({ seed });
    const repeated = createSearchRound({ seed });
    const scene = getSearchScene(round);
    assert.deepEqual(round, repeated);
    assert.equal(scene, peekabooSceneForSeed(seed));
    for (let index = 0; index < 3; index += 1) {
      const content = getPocketContentId(round, index);
      if (content) assert.ok(scene.itemIds.includes(content));
    }
  }
});

test("an explicit scene can be selected and malformed scenes are rejected", () => {
  assert.equal(getSearchScene(createSearchRound({ seed: 9, sceneId: "sea" })).id, "sea");
  assert.throws(() => getPeekabooScene("missing"), RangeError);
  assert.throws(() => validatePeekabooScene({ ...PEEKABOO_SCENES[0], itemIds: ["cat", "cat", "bird"] }), RangeError);
});
