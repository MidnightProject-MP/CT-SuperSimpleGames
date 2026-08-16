import test from "node:test";
import assert from "node:assert/strict";
import {
  MAX_SCENE_OBJECTS,
  SCENE_KINDS,
  VARIANT_COUNT,
  createSceneState,
  moveSceneObject,
  placeSceneObject,
  relationshipsForScene,
  selectSceneKind,
  touchSceneObject,
} from "../src/story-scene.js";

test("a story scene starts immediately ready to place a flower", () => {
  const state = createSceneState();
  assert.equal(state.selected, "flower");
  assert.deepEqual(state.objects, []);
  assert.equal(Object.isFrozen(state), true);
  assert.equal(Object.isFrozen(state.objects), true);
});

test("selecting every scene kind is immutable and bounded to the cast", () => {
  const initial = createSceneState();
  for (const kind of SCENE_KINDS) assert.equal(selectSceneKind(initial, kind).selected, kind);
  assert.equal(initial.selected, "flower");
  assert.throws(() => selectSceneKind(initial, "dragon"), RangeError);
});

test("placements cycle five variants and stay inside broad scene bounds", () => {
  let state = createSceneState();
  const variants = [];
  for (let index = 0; index < VARIANT_COUNT + 1; index += 1) {
    const result = placeSceneObject(state, { x: index % 2 ? 4 : -3, y: index % 2 ? 7 : -2 });
    state = result.state;
    variants.push(result.object.variant);
    assert.ok(result.object.x >= 0.08 && result.object.x <= 0.92);
    assert.ok(result.object.y >= 0.16 && result.object.y <= 0.88);
  }
  assert.deepEqual(variants, [0, 1, 2, 3, 4, 0]);
});

test("touching an existing object cycles it without replacing the scene", () => {
  const placed = placeSceneObject(createSceneState(), { x: 0.4, y: 0.5 });
  const changed = touchSceneObject(placed.state, placed.object.id);
  assert.equal(changed.action, "changed");
  assert.equal(changed.object.variant, 1);
  assert.equal(changed.object.visits, 1);
  assert.equal(changed.state.objects.length, 1);
});

test("moving objects reveals deterministic nearby relationships", () => {
  let state = selectSceneKind(createSceneState(), "sun");
  state = placeSceneObject(state, { x: 0.3, y: 0.3 }).state;
  state = selectSceneKind(state, "cloud");
  const cloud = placeSceneObject(state, { x: 0.8, y: 0.3 });
  assert.deepEqual(relationshipsForScene(cloud.state), []);
  const moved = moveSceneObject(cloud.state, cloud.object.id, { x: 0.48, y: 0.3 });
  assert.equal(moved.relationships[0].type, "rainbow");
  assert.equal(relationshipsForScene(moved.state).length, 1);
});

test("relationship reach follows visible distance across orientations", () => {
  let portrait = selectSceneKind(createSceneState(), "sun");
  portrait = placeSceneObject(portrait, { x: 0.3, y: 0.3 }).state;
  portrait = selectSceneKind(portrait, "cloud");
  portrait = placeSceneObject(portrait, { x: 0.5, y: 0.3 }).state;
  assert.equal(relationshipsForScene(portrait, { width: 320, height: 640 }).length, 1);

  let landscape = selectSceneKind(createSceneState(), "sun");
  landscape = placeSceneObject(landscape, { x: 0.3, y: 0.3 }).state;
  landscape = selectSceneKind(landscape, "cloud");
  landscape = placeSceneObject(landscape, { x: 0.38, y: 0.3 }).state;
  assert.equal(relationshipsForScene(landscape, { width: 800, height: 320 }).length, 1);
  assert.throws(() => relationshipsForScene(landscape, { width: 0, height: 320 }), RangeError);
});

test("flowers respond predictably to nearby weather", () => {
  let state = placeSceneObject(createSceneState(), { x: 0.5, y: 0.62 }).state;
  state = selectSceneKind(state, "cloud");
  state = placeSceneObject(state, { x: 0.42, y: 0.45 }).state;
  state = selectSceneKind(state, "sun");
  state = placeSceneObject(state, { x: 0.58, y: 0.45 }).state;
  assert.deepEqual(relationshipsForScene(state).map(({ type }) => type).sort(), ["rainbow", "warmed", "watered"]);
});

test("two nearby friends greet but a distant friend stays independent", () => {
  let state = selectSceneKind(createSceneState(), "friend");
  state = placeSceneObject(state, { x: 0.2, y: 0.7 }).state;
  state = placeSceneObject(state, { x: 0.37, y: 0.7 }).state;
  state = placeSceneObject(state, { x: 0.8, y: 0.7 }).state;
  const greetings = relationshipsForScene(state).filter(({ type }) => type === "greeting");
  assert.equal(greetings.length, 1);
});

test("the object limit revisits a nearby selected object instead of erasing work", () => {
  let state = createSceneState();
  for (let index = 0; index < MAX_SCENE_OBJECTS; index += 1) {
    state = placeSceneObject(state, { x: 0.1 + ((index % 8) * 0.1), y: 0.25 + (Math.floor(index / 8) * 0.4) }).state;
  }
  const before = state.objects.map(({ id }) => id);
  const result = placeSceneObject(state, { x: 0.1, y: 0.25 });
  assert.equal(result.state.objects.length, MAX_SCENE_OBJECTS);
  assert.deepEqual(result.state.objects.map(({ id }) => id), before);
  assert.equal(result.action, "changed");
  assert.equal(result.object.visits, 1);
});

test("invalid states, IDs, and coordinates are rejected", () => {
  const state = createSceneState();
  assert.throws(() => placeSceneObject(state, { x: NaN, y: 0.4 }), TypeError);
  assert.throws(() => touchSceneObject(state, "missing"), RangeError);
  assert.throws(() => moveSceneObject(state, "missing", { x: 0.3, y: 0.4 }), RangeError);
  assert.throws(() => relationshipsForScene({ selected: "flower", objects: [], nextId: 0 }), TypeError);
});
