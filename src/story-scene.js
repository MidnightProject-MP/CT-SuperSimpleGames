import { STORY_PACKS, STORY_VARIANT_COUNT, getStoryPack, storyCastItem, storyRelationship } from "./story-packs.js";

export const SCENE_KINDS = Object.freeze(STORY_PACKS.flatMap((pack) => pack.cast.map(({ kind }) => kind)));
export const VARIANT_COUNT = STORY_VARIANT_COUNT;
export const MAX_SCENE_OBJECTS = 16;
export const MAX_SCENE_RELATIONSHIPS = 12;
export const INTERACTION_PHASES = Object.freeze(["active", "paused", "reversed"]);

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

function createState(sceneId, selected, objects, nextId, interactions = []) {
  return Object.freeze({
    sceneId,
    selected,
    objects: Object.freeze(objects.map(freezeObject)),
    interactions: Object.freeze(interactions.map((interaction) => Object.freeze({ ...interaction }))),
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
  const kindCounts = new Map();
  const objects = state.objects.map((object) => {
    if (!object || typeof object.id !== "string" || ids.has(object.id)) {
      throw new TypeError("story scene contains an invalid object");
    }
    ids.add(object.id);
    const castItem = storyCastItem(pack, object.kind);
    const kindCount = (kindCounts.get(object.kind) || 0) + 1;
    if (kindCount > castItem.limit) throw new RangeError(`story scene exceeds the ${object.kind} limit`);
    kindCounts.set(object.kind, kindCount);
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
  const interactions = (state.interactions || []).map((interaction) => {
    const firstObject = objects.find(({ id }) => id === interaction?.first);
    const secondObject = objects.find(({ id }) => id === interaction?.second);
    const definition = firstObject && secondObject ? storyRelationship(pack, firstObject.kind, secondObject.kind) : null;
    if (!interaction || typeof interaction.key !== "string" || typeof interaction.first !== "string"
      || typeof interaction.second !== "string" || !ids.has(interaction.first) || !ids.has(interaction.second)
      || interaction.first === interaction.second || !INTERACTION_PHASES.includes(interaction.phase)
      || interaction.key !== [interaction.first, interaction.second].sort().join("|")
      || !definition || interaction.type !== definition.type
      || !Number.isInteger(interaction.turns) || interaction.turns < 0) {
      throw new TypeError("story scene contains an invalid interaction");
    }
    return { ...interaction };
  });
  if (interactions.length > MAX_SCENE_RELATIONSHIPS || new Set(interactions.map(({ key }) => key)).size !== interactions.length) {
    throw new RangeError("story scene interactions are not bounded and unique");
  }
  return { sceneId: state.sceneId, selected: state.selected, objects, interactions, nextId: state.nextId };
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
  return createState(current.sceneId, kind, current.objects, current.nextId, current.interactions);
}

export function selectNextSceneKind(state) {
  const current = normalizeState(state);
  const cast = getStoryPack(current.sceneId).cast;
  const index = cast.findIndex(({ kind }) => kind === current.selected);
  return createState(current.sceneId, cast[(index + 1) % cast.length].kind, current.objects, current.nextId, current.interactions);
}

function nearbyRelationships(state, layout) {
  const current = normalizeState(state);
  const pack = getStoryPack(current.sceneId);
  const relationships = [];
  for (let firstIndex = 0; firstIndex < current.objects.length; firstIndex += 1) {
    for (let secondIndex = firstIndex + 1; secondIndex < current.objects.length; secondIndex += 1) {
      const first = current.objects[firstIndex];
      const second = current.objects[secondIndex];
      const definition = storyRelationship(pack, first.kind, second.kind);
      if (definition && distance(first, second, layout) <= RELATION_DISTANCE) {
        relationships.push({
          key: [first.id, second.id].sort().join("|"),
          definition,
          type: definition.type,
          first: first.id,
          second: second.id,
        });
        if (relationships.length >= MAX_SCENE_RELATIONSHIPS) return relationships;
      }
    }
  }
  return relationships;
}

function reconcileInteractions(state, layout, cycleForId = null) {
  const current = normalizeState(state);
  const prior = new Map(current.interactions.map((interaction) => [interaction.key, interaction]));
  return nearbyRelationships(current, layout).map((relationship) => {
    const existing = prior.get(relationship.key) || { phase: "active", turns: 0 };
    const cycles = cycleForId && [relationship.first, relationship.second].includes(cycleForId);
    const phase = cycles
      ? INTERACTION_PHASES[(INTERACTION_PHASES.indexOf(existing.phase) + 1) % INTERACTION_PHASES.length]
      : existing.phase;
    return Object.freeze({
      key: relationship.key,
      type: relationship.type,
      first: relationship.first,
      second: relationship.second,
      phase,
      turns: existing.turns + (cycles ? 1 : 0),
    });
  });
}

export function relationshipsForScene(state, layout) {
  const current = normalizeState(state);
  const interactions = new Map(current.interactions.map((interaction) => [interaction.key, interaction]));
  return Object.freeze(nearbyRelationships(current, layout).map((relationship) => {
    const interaction = interactions.get(relationship.key) || { phase: "active", turns: 0 };
    const presentation = relationship.definition.states.find(({ phase }) => phase === interaction.phase);
    return Object.freeze({
      type: relationship.type,
      message: presentation.message,
      first: relationship.first,
      second: relationship.second,
      phase: interaction.phase,
      turns: interaction.turns,
    });
  }));
}

export function compositionsForScene(state, layout) {
  const current = normalizeState(state);
  if (current.sceneId !== "castle") return Object.freeze([]);

  const people = current.objects.filter(({ kind }) => kind === "person");
  const horses = current.objects.filter(({ kind }) => kind === "horse");
  const armor = current.objects.filter(({ kind }) => kind === "armor");
  const dragons = current.objects.filter(({ kind }) => kind === "dragon");
  const compositions = [];

  for (const person of people) {
    const horse = horses.find((candidate) => distance(person, candidate, layout) <= RELATION_DISTANCE);
    const suit = armor.find((candidate) => distance(person, candidate, layout) <= RELATION_DISTANCE);
    if (horse && suit) {
      const dragon = dragons.find((candidate) => distance(person, candidate, layout) <= RELATION_DISTANCE);
      const participants = dragon ? [person, horse, suit, dragon] : [person, horse, suit];
      compositions.push(Object.freeze({
        type: dragon ? "royal-rescue" : "armored-rider",
        participants: Object.freeze(participants.map(({ id }) => id)),
        x: participants.reduce((sum, object) => sum + object.x, 0) / participants.length,
        y: participants.reduce((sum, object) => sum + object.y, 0) / participants.length,
        message: dragon
          ? "The brave friends greet the dragon, and the royal friend comes out to join them!"
          : "Armor, horse, and person become an armored rider!",
      }));
    } else if (horse) {
      compositions.push(Object.freeze({
        type: "rider",
        participants: Object.freeze([person.id, horse.id]),
        x: (person.x + horse.x) / 2,
        y: (person.y + horse.y) / 2,
        message: "Person and horse become a rider!",
      }));
    } else if (suit) {
      compositions.push(Object.freeze({
        type: "armored-hero",
        participants: Object.freeze([person.id, suit.id]),
        x: (person.x + suit.x) / 2,
        y: (person.y + suit.y) / 2,
        message: "The person puts on the armor!",
      }));
    }
    if (compositions.length >= MAX_SCENE_RELATIONSHIPS) break;
  }
  return Object.freeze(compositions);
}

function updateState(current, objects, nextId, layout, cycleForId = null) {
  const preliminary = createState(current.sceneId, current.selected, objects, nextId, current.interactions);
  return createState(current.sceneId, current.selected, objects, nextId, reconcileInteractions(preliminary, layout, cycleForId));
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
  const nextState = updateState(current, objects, current.nextId, layout, id);
  return resultFor(nextState, objectById(nextState.objects, id), "changed", layout);
}

export function moveSceneObject(state, id, point, layout) {
  const current = normalizeState(state);
  objectById(current.objects, id);
  const position = normalizePoint(point);
  const objects = current.objects.map((object) => object.id === id
    ? { ...object, ...position, visits: object.visits + 1 }
    : object);
  const nextState = updateState(current, objects, current.nextId, layout);
  return resultFor(nextState, objectById(nextState.objects, id), "moved", layout);
}

export function placeSceneObject(state, point, layout) {
  const current = normalizeState(state);
  const position = normalizePoint(point);

  const selectedObjects = current.objects.filter((object) => object.kind === current.selected);
  const selectedLimit = storyCastItem(getStoryPack(current.sceneId), current.selected).limit;
  if (selectedObjects.length >= selectedLimit) {
    const nearest = [...selectedObjects].sort((left, right) => distance(left, position, layout) - distance(right, position, layout))[0];
    return touchSceneObject(state, nearest.id, layout);
  }

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
  const objects = [...current.objects, object];
  const nextState = updateState(current, objects, current.nextId + 1, layout);
  return resultFor(nextState, objectById(nextState.objects, object.id), "placed", layout);
}
