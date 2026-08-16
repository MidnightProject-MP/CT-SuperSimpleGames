import { POCKET_COUNT, createRound, togglePocket } from "./pockets.js";

function validateIndex(index, name) {
  if (!Number.isInteger(index) || index < 0 || index >= POCKET_COUNT) {
    throw new RangeError(`${name} must be a valid pocket index`);
  }
  return index;
}

function createSearchState({ pockets, emptyIndex, targetIndex, targetFound }) {
  validateIndex(emptyIndex, "emptyIndex");
  validateIndex(targetIndex, "targetIndex");
  if (emptyIndex === targetIndex) throw new RangeError("the target pocket cannot be empty");
  if (typeof targetFound !== "boolean") throw new TypeError("targetFound must be a boolean");
  if (targetFound !== pockets.discovered[targetIndex]) {
    throw new RangeError("targetFound must match target-pocket discovery");
  }
  return Object.freeze({ pockets, emptyIndex, targetIndex, targetFound });
}

function normalizeSearchState(state) {
  if (!state || typeof state !== "object" || !state.pockets) {
    throw new TypeError("search state must contain pockets");
  }
  return createSearchState(state);
}

export function createSearchRound(input) {
  const pockets = createRound(input);
  const emptyIndex = pockets.seed % POCKET_COUNT;
  const possibleTargets = Array.from({ length: POCKET_COUNT }, (_, index) => index)
    .filter((index) => index !== emptyIndex);
  const targetIndex = possibleTargets[Math.floor(pockets.seed / POCKET_COUNT) % possibleTargets.length];
  return createSearchState({ pockets, emptyIndex, targetIndex, targetFound: false });
}

export function getTargetItemId(state) {
  const current = normalizeSearchState(state);
  return current.pockets.itemIds[current.targetIndex];
}

export function getPocketContentId(state, index) {
  const current = normalizeSearchState(state);
  const pocketIndex = validateIndex(index, "index");
  return pocketIndex === current.emptyIndex ? null : current.pockets.itemIds[pocketIndex];
}

export function toggleSearchPocket(state, index) {
  const current = normalizeSearchState(state);
  const pocketIndex = validateIndex(index, "index");
  const result = togglePocket(current.pockets, pocketIndex);
  const empty = pocketIndex === current.emptyIndex;
  const target = pocketIndex === current.targetIndex;
  const foundNow = result.open && target && !current.targetFound;
  const targetFound = current.targetFound || foundNow;
  const nextState = createSearchState({
    pockets: result.state,
    emptyIndex: current.emptyIndex,
    targetIndex: current.targetIndex,
    targetFound
  });

  return Object.freeze({
    ...result,
    state: nextState,
    pockets: result.state,
    contentId: empty ? null : result.itemId,
    empty,
    target,
    foundNow,
    targetFound
  });
}

export function searchGreetingPair(state, index) {
  const current = normalizeSearchState(state);
  const pocketIndex = validateIndex(index, "index");
  if (pocketIndex === current.emptyIndex || !current.pockets.open[pocketIndex]) return null;

  const partners = current.pockets.open
    .map((isOpen, partnerIndex) => ({ isOpen, partnerIndex }))
    .filter(({ isOpen, partnerIndex }) => (
      isOpen && partnerIndex !== pocketIndex && partnerIndex !== current.emptyIndex
    ))
    .sort((left, right) => (
      Math.abs(left.partnerIndex - pocketIndex) - Math.abs(right.partnerIndex - pocketIndex)
      || left.partnerIndex - right.partnerIndex
    ));

  if (partners.length === 0) return null;
  return Object.freeze([pocketIndex, partners[0].partnerIndex]);
}

