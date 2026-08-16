import { STORY_PACKS, STORY_VARIANT_COUNT, getStoryPack, storyCastItem, storyRelationship } from "./story-packs.js";

export const SCENE_KINDS = Object.freeze(STORY_PACKS.flatMap((pack) => pack.cast.map(({ kind }) => kind)));
export const VARIANT_COUNT = STORY_VARIANT_COUNT;
export const MAX_SCENE_OBJECTS = 16;
export const MAX_SCENE_RELATIONSHIPS = 12;

const MIN_X = 0.08;
const MAX_X = 0.92;
const MIN_Y = 0.16;
const MAX_Y = 0.88;
const RELATION_DISTANCE = 0.32;

function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum);
}

function normalizePoint(point) {
  if (!point || !Number.isFinite(point.x) || !Number.isFinite(point.y)) {
    throw new TypeError("scene point must have finite coordinates");
  }
  return Object.freeze({
    x: clamp(point.x, MIN_X, MAX_X),
    y: clamp(point.y, MIN_Y, MAX_Y),
  });
}

function freezeObject(object) {
  return Object.freeze({ ...object });
}

function createState(sceneId, selected, objects, nextId) {
  return Object.freeze({
    sceneId,
    selected,
    objects: Object.freeze(objects.map(freezeObject)),
    nextId,
  });
}

function normalizeState(state) {
  if (!state || typeof state !== "object"
    || !Array.isArray(state.objects) || !Number.isInteger(state.nextId) || state.nextId < 1) {
    throw new TypeError("invalid story scene state");
  }
  const pack = getStoryPack(state.sceneId);
  storyCastItem(pack, state.selected);
  if (state.objects.length > MAX_SCENE_OBJECTS) throw new RangeError("story scene exceeds its object limit");

  const ids = new Set();
  const objects = state.objects.map((object) => {
    if (!object || typeof object.id !== "string" || ids.has(object.id)) {
      throw new TypeError("story scene contains an invalid object");
    }
    ids.add(object.id);
    storyCastItem(pack, object.kind);
    if (!Number.isInteger(object.variant) || object.variant < 0 || object.variant >= VARIANT_COUNT) {
      throw new RangeError("story scene variant is out of range");
    }
    if (!Number.isFinite(object.x) || object.x < MIN_X || object.x > MAX_X
      || !Number.isFinite(object.y) || object.y < MIN_Y || object.y > MAX_Y) {
      throw new RangeError("story scene object is out of bounds");
    }
    if (!Number.isInteger(object.visits) || object.visits < 0) {
      throw new RangeError("story scene visits must be non-negative");
    }
    return { ...object };
  });
  return { sceneId: state.sceneId, selected: state.selected, objects, nextId: state.nextId };
}

function objectById(objects, id) {
  const object = objects.find((candidate) => candidate.id === id);
  if (!object) throw new RangeError(`unknown story scene object: ${id}`);
  return object;
}

function layoutMetrics(layout = { width: 1, height: 1 }) {
  if (!layout || !Number.isFinite(layout.width) || !Number.isFinite(layout.height)
    || layout.width <= 0 || layout.height <= 0) {
    throw new RangeError("scene layout must have positive finite dimensions");
  }
  return { ...layout, unit: Math.min(layout.width, layout.height) };
}

function distance(first, second, layout) {
  const metrics = layoutMetrics(layout);
  return Math.hypot(
    ((first.x - second.x) * metrics.width) / metrics.unit,
    ((first.y - second.y) * metrics.height) / metrics.unit,
  );
}

export function createSceneState(sceneId = "garden") {
  const pack = getStoryPack(sceneId);
  return createState(pack.id, pack.defaultKind, [], 1);
}

export function selectScenePack(state, sceneId) {
  normalizeState(state);
  return createSceneState(sceneId);
}

export function selectSceneKind(state, kind) {
  const current = normalizeState(state);
  storyCastItem(getStoryPack(current.sceneId), kind);
  return createState(current.sceneId, kind, current.objects, current.nextId);
}

export function relationshipsForScene(state, layout) {
  const current = normalizeState(state);
  const pack = getStoryPack(current.sceneId);
  const relationships = [];
  for (let firstIndex = 0; firstIndex < current.objects.length; firstIndex += 1) {
    for (let secondIndex = firstIndex + 1; secondIndex < current.objects.length; secondIndex += 1) {
      const first = current.objects[firstIndex];
      const second = current.objects[secondIndex];
      const definition = storyRelationship(pack, first.kind, second.kind);
      if (definition && distance(first, second, layout) <= RELATION_DISTANCE) {
        relationships.push(Object.freeze({ type: definition.type, message: definition.message, first: first.id, second: second.id }));
        if (relationships.length >= MAX_SCENE_RELATIONSHIPS) return Object.freeze(relationships);
      }
    }
  }
  return Object.freeze(relationships);
}

function resultFor(state, object, action, layout) {
  const relationships = relationshipsForScene(state, layout)
    .filter((relationship) => relationship.first === object.id || relationship.second === object.id);
  return Object.freeze({ state, object, action, relationships: Object.freeze(relationships) });
}

export function touchSceneObject(state, id, layout) {
  const current = normalizeState(state);
  const existing = objectById(current.objects, id);
  const objects = current.objects.map((object) => object.id === id
    ? { ...object, variant: (object.variant + 1) % VARIANT_COUNT, visits: object.visits + 1 }
    : object);
  const nextState = createState(current.sceneId, current.selected, objects, current.nextId);
  return resultFor(nextState, objectById(nextState.objects, id), "changed", layout);
}

export function moveSceneObject(state, id, point, layout) {
  const current = normalizeState(state);
  objectById(current.objects, id);
  const position = normalizePoint(point);
  const objects = current.objects.map((object) => object.id === id
    ? { ...object, ...position, visits: object.visits + 1 }
    : object);
  const nextState = createState(current.sceneId, current.selected, objects, current.nextId);
  return resultFor(nextState, objectById(nextState.objects, id), "moved", layout);
}

export function placeSceneObject(state, point, layout) {
  const current = normalizeState(state);
  const position = normalizePoint(point);

  if (current.objects.length >= MAX_SCENE_OBJECTS) {
    const preferred = current.objects.filter((object) => object.kind === current.selected);
    const candidates = preferred.length ? preferred : current.objects;
    const nearest = [...candidates].sort((left, right) => distance(left, position, layout) - distance(right, position, layout))[0];
    return touchSceneObject(state, nearest.id, layout);
  }

  const variant = current.objects.filter((object) => object.kind === current.selected).length % VARIANT_COUNT;
  const object = {
    id: `scene-${current.nextId}`,
    kind: current.selected,
    variant,
    ...position,
    visits: 0,
  };
  const nextState = createState(current.sceneId, current.selected, [...current.objects, object], current.nextId + 1);
  return resultFor(nextState, objectById(nextState.objects, object.id), "placed", layout);
}
