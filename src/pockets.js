/**
 * Pure state and transitions for Peekaboo Pockets.
 *
 * A round always has three pockets. Opening a pocket reveals its familiar
 * item/pattern pair and records that the pocket has been discovered. Closing
 * a pocket never forgets that discovery, so completion is held for the rest
 * of the round.
 */

export const POCKET_COUNT = 3;

// IDs stay deliberately small and visual. A UI can map them to an illustration
// without making the game logic depend on any browser or rendering API.
export const ITEM_CATALOG = Object.freeze([
  "apple",
  "ball",
  "bear",
  "bird",
  "cat",
  "duck",
  "flower",
  "moon",
  "star",
  "sun"
]);

export const PATTERN_CATALOG = Object.freeze([
  "checks",
  "dots",
  "hearts",
  "rings",
  "stars",
  "stripes",
  "waves",
  "zigzags"
]);

const MAX_SEED = 0xffffffff;

function fail(message, ErrorType = TypeError) {
  throw new ErrorType(message);
}

function validateSeed(seed) {
  if (!Number.isSafeInteger(seed) || seed < 0 || seed > MAX_SEED) {
    fail("seed must be an unsigned 32-bit integer", RangeError);
  }
  return seed;
}

function readSeed(input) {
  if (typeof input === "number") return validateSeed(input);
  if (!input || typeof input !== "object" || !("seed" in input)) {
    fail("createRound requires an explicit seed");
  }
  return validateSeed(input.seed);
}

// Mulberry32 is compact, deterministic, and gives different early values for
// nearby seeds without relying on mutable global state.
function createRandom(seed) {
  let state = seed >>> 0;

  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 0x100000000;
  };
}

function chooseDistinct(catalog, count, random) {
  const values = catalog.slice();
  for (let index = values.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [values[index], values[swapIndex]] = [values[swapIndex], values[index]];
  }
  return values.slice(0, count);
}

function freezeArray(values) {
  return Object.freeze(values.slice());
}

function createState({ seed, itemIds, patternIds, open, discovered, complete }) {
  return Object.freeze({
    seed,
    itemIds: freezeArray(itemIds),
    patternIds: freezeArray(patternIds),
    open: freezeArray(open),
    discovered: freezeArray(discovered),
    complete
  });
}

function isArrayOrTypedArray(value) {
  return Array.isArray(value) || (ArrayBuffer.isView(value) && !(value instanceof DataView));
}

function cloneFlags(value, name) {
  if (!isArrayOrTypedArray(value)) {
    fail(`${name} must be an array or typed array`);
  }
  if (value.length !== POCKET_COUNT) {
    fail(`${name} must contain exactly ${POCKET_COUNT} flags`, RangeError);
  }

  return Array.from(value, (flag) => {
    if (flag === true || flag === 1) return true;
    if (flag === false || flag === 0) return false;
    fail(`${name} flags must be booleans or zero/one`, RangeError);
  });
}

function cloneIds(value, name, catalog) {
  if (!Array.isArray(value)) fail(`${name} must be an array`);
  if (value.length !== POCKET_COUNT) {
    fail(`${name} must contain exactly ${POCKET_COUNT} IDs`, RangeError);
  }

  const valid = new Set(catalog);
  const ids = value.slice();
  if (ids.some((id) => typeof id !== "string" || !valid.has(id))) {
    fail(`${name} must contain IDs from its catalog`, RangeError);
  }
  if (new Set(ids).size !== POCKET_COUNT) {
    fail(`${name} must contain distinct IDs`, RangeError);
  }
  return ids;
}

function normalizeState(state) {
  if (!state || typeof state !== "object") fail("state must be an object");

  const seed = validateSeed(state.seed);
  const itemIds = cloneIds(state.itemIds, "itemIds", ITEM_CATALOG);
  const patternIds = cloneIds(state.patternIds, "patternIds", PATTERN_CATALOG);
  const open = cloneFlags(state.open, "open");
  const discovered = cloneFlags(state.discovered, "discovered");

  for (let index = 0; index < POCKET_COUNT; index += 1) {
    if (open[index] && !discovered[index]) {
      fail("an open pocket must already be discovered", RangeError);
    }
  }

  const complete = state.complete;
  if (typeof complete !== "boolean") fail("complete must be a boolean");
  const discoveredAll = discovered.every(Boolean);
  if (complete !== discoveredAll) {
    fail("complete must match whether every pocket is discovered", RangeError);
  }

  return { seed, itemIds, patternIds, open, discovered, complete };
}

function validateIndex(index) {
  if (!Number.isInteger(index) || index < 0 || index >= POCKET_COUNT) {
    fail(`index must be an integer from 0 to ${POCKET_COUNT - 1}`, RangeError);
  }
  return index;
}

function readable(id) {
  return id.replace(/[-_]+/g, " ");
}

function buildAnnouncement({ index, itemId, patternId, opening, discoveredNow, completedNow }) {
  const pocket = index + 1;
  if (!opening) return `Pocket ${pocket} closed`;

  const discovery = discoveredNow ? "discovered" : "opened again";
  const message = `Pocket ${pocket} ${discovery}: ${readable(itemId)} with ${readable(patternId)}`;
  return completedNow ? `${message}. All three pockets discovered!` : message;
}

/**
 * Create a fresh deterministic round. `createRound({ seed })` is the primary
 * form, while a numeric seed is accepted for convenient use in small callers.
 */
export function createRound(input) {
  const seed = readSeed(input);
  const random = createRandom(seed);
  const itemIds = chooseDistinct(ITEM_CATALOG, POCKET_COUNT, random);
  const patternIds = chooseDistinct(PATTERN_CATALOG, POCKET_COUNT, random);

  return createState({
    seed,
    itemIds,
    patternIds,
    open: [false, false, false],
    discovered: [false, false, false],
    complete: false
  });
}

/**
 * Toggle one pocket without changing the supplied state. Discovery is
 * monotonic and completion remains true once reached, even if pockets close.
 */
export function togglePocket(state, index) {
  const current = normalizeState(state);
  const pocketIndex = validateIndex(index);
  const opening = !current.open[pocketIndex];
  const open = current.open.slice();
  const discovered = current.discovered.slice();
  const discoveredNow = opening && !discovered[pocketIndex];

  open[pocketIndex] = opening;
  if (opening) discovered[pocketIndex] = true;

  const complete = discovered.every(Boolean);
  const completedNow = complete && !current.complete;
  const nextState = createState({
    seed: current.seed,
    itemIds: current.itemIds,
    patternIds: current.patternIds,
    open,
    discovered,
    complete
  });
  const itemId = current.itemIds[pocketIndex];
  const patternId = current.patternIds[pocketIndex];

  return Object.freeze({
    state: nextState,
    index: pocketIndex,
    itemId,
    patternId,
    open: opening,
    opened: opening,
    discovered: discovered[pocketIndex],
    discoveredNow,
    complete,
    completedNow,
    openCount: open.filter(Boolean).length,
    discoveredCount: discovered.filter(Boolean).length,
    action: opening ? "open" : "close",
    announcement: buildAnnouncement({
      index: pocketIndex,
      itemId,
      patternId,
      opening,
      discoveredNow,
      completedNow
    })
  });
}

// Explicit aliases make the game-specific name available without duplicating
// any behavior or state model.
export const createPocketsRound = createRound;
export const togglePockets = togglePocket;
