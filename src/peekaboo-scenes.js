import { ITEM_CATALOG, PATTERN_CATALOG, POCKET_COUNT } from "./pockets.js";

function scene(id, label, containerName, itemIds, patternIds) {
  return Object.freeze({
    id,
    label,
    containerName,
    itemIds: Object.freeze(itemIds),
    patternIds: Object.freeze(patternIds),
    emergence: "rise",
    relationship: "greet"
  });
}

export const PEEKABOO_SCENES = Object.freeze([
  scene("animals", "Cozy animals", "bed", ["cat", "bear", "bird", "duck"], ["checks", "hearts", "dots"]),
  scene("vehicles", "Busy vehicles", "garage", ["car", "bus", "plane", "boat"], ["stripes", "checks", "zigzags"]),
  scene("weather", "Sky friends", "cloud", ["sun", "moon", "star", "cloud"], ["stars", "waves", "dots"]),
  scene("sea", "Sea friends", "shell", ["fish", "whale", "octopus", "turtle"], ["waves", "rings", "dots"])
]);

export function validatePeekabooScene(value) {
  if (!value || typeof value.id !== "string" || !value.id) throw new TypeError("scene id is required");
  if (typeof value.label !== "string" || !value.label) throw new TypeError("scene label is required");
  if (typeof value.containerName !== "string" || !value.containerName) throw new TypeError("container name is required");
  if (!Array.isArray(value.itemIds) || value.itemIds.length < POCKET_COUNT) throw new RangeError("scene needs at least three items");
  if (new Set(value.itemIds).size !== value.itemIds.length || value.itemIds.some((id) => !ITEM_CATALOG.includes(id))) {
    throw new RangeError("scene items must be distinct catalog identities");
  }
  if (!Array.isArray(value.patternIds) || value.patternIds.length < POCKET_COUNT) throw new RangeError("scene needs three patterns");
  if (new Set(value.patternIds).size < POCKET_COUNT || value.patternIds.some((id) => !PATTERN_CATALOG.includes(id))) {
    throw new RangeError("scene patterns must be distinct catalog identities");
  }
  if (value.emergence !== "rise" || value.relationship !== "greet") throw new RangeError("scene behavior is invalid");
  return value;
}

export function getPeekabooScene(id) {
  const value = PEEKABOO_SCENES.find((candidate) => candidate.id === id);
  if (!value) throw new RangeError(`unknown peekaboo scene: ${id}`);
  return validatePeekabooScene(value);
}

export function peekabooSceneForSeed(seed) {
  if (!Number.isSafeInteger(seed) || seed < 0 || seed > 0xffffffff) throw new RangeError("seed must be unsigned 32-bit");
  return PEEKABOO_SCENES[seed % PEEKABOO_SCENES.length];
}
