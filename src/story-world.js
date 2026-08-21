import { STORY_PACKS } from "./story-packs.js";
import { restoreSceneState, serializeSceneState } from "./story-scene.js";

export const STORY_WORLD_IDS = Object.freeze(STORY_PACKS.map(({ id }) => id));

function validId(id) {
  return STORY_WORLD_IDS.includes(id);
}

function restoreSlot(snapshot) {
  return restoreSceneState(JSON.parse(JSON.stringify(snapshot)));
}

export function serializeStoryWorld(activeId, scenesById) {
  if (!validId(activeId)) throw new RangeError("story world requires a known active scene");
  if (!scenesById || typeof scenesById !== "object" || !scenesById[activeId]) {
    throw new TypeError("story world serialization requires the active scene");
  }
  const scenes = {};
  for (const [id, state] of Object.entries(scenesById)) {
    if (!validId(id)) throw new RangeError(`unknown story scene: ${id}`);
    scenes[id] = serializeSceneState(state);
  }
  return Object.freeze({ kind: "story-world", version: 1, active: activeId, scenes: Object.freeze(scenes) });
}

export function restoreStoryWorld(snapshot) {
  if (!snapshot || typeof snapshot !== "object") throw new TypeError("invalid story world snapshot");
  if (!snapshot.scenes) {
    const legacy = restoreSlot(snapshot);
    return Object.freeze({ active: legacy.sceneId, scenes: Object.freeze({ [legacy.sceneId]: legacy }) });
  }
  const entries = Object.entries(snapshot.scenes);
  if (!entries.length) throw new RangeError("story world snapshot contains no scenes");
  const scenes = {};
  for (const [id, slot] of entries) {
    if (!validId(id)) throw new RangeError(`unknown story scene: ${id}`);
    if (!slot || typeof slot !== "object") throw new TypeError("story world contains an invalid scene");
    scenes[id] = restoreSlot(slot);
  }
  if (!validId(snapshot.active)) throw new RangeError("story world snapshot lacks a known active scene");
  if (!scenes[snapshot.active]) throw new RangeError("story world active scene is not among its slots");
  return Object.freeze({ active: snapshot.active, scenes: Object.freeze(scenes) });
}
