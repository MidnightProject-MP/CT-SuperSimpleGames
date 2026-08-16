import test from "node:test";
import assert from "node:assert/strict";
import {
  MAX_SCENE_OBJECTS,
  INTERACTION_PHASES,
  SCENE_KINDS,
  VARIANT_COUNT,
  compositionsForScene,
  createSceneState,
  moveSceneObject,
  placeSceneObject,
  relationshipsForScene,
  selectSceneKind,
  selectNextSceneKind,
  selectScenePack,
  touchSceneObject,
} from "../src/story-scene.js";
import { STORY_PACKS, validateStoryPack } from "../src/story-packs.js";

test("a story scene starts immediately ready to place a flower", () => {
  const state = createSceneState();
  assert.equal(state.selected, "flower");
  assert.equal(state.sceneId, "garden");
  assert.deepEqual(state.objects, []);
  assert.equal(Object.isFrozen(state), true);
  assert.equal(Object.isFrozen(state.objects), true);
});

test("selecting every scene kind is immutable and bounded to the cast", () => {
  const initial = createSceneState();
  for (const kind of STORY_PACKS[0].cast.map(({ kind }) => kind)) assert.equal(selectSceneKind(initial, kind).selected, kind);
  assert.equal(initial.selected, "flower");
  assert.throws(() => selectSceneKind(initial, "dragon"), RangeError);
  assert.ok(SCENE_KINDS.includes("dragon"));
});

test("ordinary placement can advance through every cast family while exact selection remains available", () => {
  const initial = createSceneState("castle");
  const horse = selectNextSceneKind(initial);
  const armor = selectNextSceneKind(horse);
  const dragon = selectNextSceneKind(armor);
  assert.deepEqual([initial.selected, horse.selected, armor.selected, dragon.selected, selectNextSceneKind(dragon).selected],
    ["person", "horse", "armor", "dragon", "person"]);
  assert.equal(selectSceneKind(dragon, "horse").selected, "horse");
  assert.equal(initial.selected, "person");
});

test("three validated packs start empty with distinct four-family vocabularies", () => {
  for (const pack of STORY_PACKS) {
    assert.equal(validateStoryPack(pack), pack);
    const state = selectScenePack(createSceneState(), pack.id);
    assert.equal(state.sceneId, pack.id);
    assert.equal(state.selected, pack.defaultKind);
    assert.deepEqual(state.objects, []);
    assert.ok(pack.relationships.length >= 3);
  }
});

test("town and castle packs produce their own repeatable relationships", () => {
  let town = createSceneState("town");
  town = placeSceneObject(town, { x: 0.4, y: 0.6 }).state;
  town = selectSceneKind(town, "car");
  town = placeSceneObject(town, { x: 0.55, y: 0.6 }).state;
  assert.equal(relationshipsForScene(town)[0].type, "riding");

  let castle = createSceneState("castle");
  castle = placeSceneObject(castle, { x: 0.4, y: 0.55 }).state;
  castle = selectSceneKind(castle, "horse");
  castle = placeSceneObject(castle, { x: 0.55, y: 0.55 }).state;
  assert.equal(relationshipsForScene(castle)[0].type, "riding");
});

test("castle ingredients form reversible rider, armor, and royal-rescue compositions", () => {
  let state = createSceneState("castle");
  const person = placeSceneObject(state, { x: 0.42, y: 0.56 });
  state = selectSceneKind(person.state, "horse");
  const horse = placeSceneObject(state, { x: 0.54, y: 0.56 });
  assert.equal(compositionsForScene(horse.state)[0].type, "rider");

  state = selectSceneKind(horse.state, "armor");
  const armor = placeSceneObject(state, { x: 0.48, y: 0.48 });
  assert.equal(compositionsForScene(armor.state)[0].type, "armored-rider");

  state = selectSceneKind(armor.state, "dragon");
  const dragon = placeSceneObject(state, { x: 0.58, y: 0.48 });
  const rescue = compositionsForScene(dragon.state)[0];
  assert.equal(rescue.type, "royal-rescue");
  assert.equal(rescue.participants.length, 4);
  assert.equal(Object.isFrozen(rescue.participants), true);

  state = moveSceneObject(dragon.state, dragon.object.id, { x: 0.9, y: 0.85 }).state;
  assert.equal(compositionsForScene(state)[0].type, "armored-rider");
  state = moveSceneObject(state, armor.object.id, { x: 0.1, y: 0.85 }).state;
  assert.equal(compositionsForScene(state)[0].type, "rider");
  state = moveSceneObject(state, horse.object.id, { x: 0.9, y: 0.2 }).state;
  assert.deepEqual(compositionsForScene(state), []);
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

test("nearby relationships persist and cycle when either participant is touched", () => {
  let state = selectSceneKind(createSceneState(), "sun");
  const sun = placeSceneObject(state, { x: 0.3, y: 0.3 });
  state = selectSceneKind(sun.state, "flower");
  const flower = placeSceneObject(state, { x: 0.48, y: 0.3 });
  state = flower.state;
  assert.equal(relationshipsForScene(state)[0].phase, "active");
  state = touchSceneObject(state, sun.object.id).state;
  assert.equal(relationshipsForScene(state)[0].phase, "paused");
  state = touchSceneObject(state, flower.object.id).state;
  assert.equal(relationshipsForScene(state)[0].phase, "reversed");
  state = touchSceneObject(state, sun.object.id).state;
  assert.equal(relationshipsForScene(state)[0].phase, "active");
  assert.deepEqual(INTERACTION_PHASES, ["active", "paused", "reversed"]);
});

test("moving a participant redirects the story to a new nearby partner", () => {
  let state = selectSceneKind(createSceneState(), "friend");
  const first = placeSceneObject(state, { x: 0.2, y: 0.7 });
  const second = placeSceneObject(first.state, { x: 0.37, y: 0.7 });
  const third = placeSceneObject(second.state, { x: 0.8, y: 0.7 });
  state = touchSceneObject(third.state, first.object.id).state;
  assert.equal(relationshipsForScene(state)[0].phase, "paused");
  state = moveSceneObject(state, first.object.id, { x: 0.72, y: 0.7 }).state;
  const relationship = relationshipsForScene(state)[0];
  assert.equal(relationship.phase, "active");
  assert.ok([relationship.first, relationship.second].includes(third.object.id));
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
  assert.throws(() => relationshipsForScene({ ...state, interactions: [{ key: "bad", first: "missing", second: "also-missing", phase: "active", turns: 0 }] }), TypeError);
});
