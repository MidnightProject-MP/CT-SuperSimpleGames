// Memory experiment core — pure, seeded, deterministic.
// Territory: matching + spatial recall over witnessed information. The child
// sees where every friend is, watches them hide, then finds the pairs.

function mulberry32(seed) {
  let value = seed >>> 0;
  return function next() {
    value = (value + 0x6d2b79f5) >>> 0;
    let mixed = Math.imul(value ^ (value >>> 15), 1 | value);
    mixed = (mixed + Math.imul(mixed ^ (mixed >>> 7), 61 | mixed)) ^ mixed;
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffled(items, random) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Creates a witnessed round: every token starts visible (`hidden: false`) so
 * the child can study the arrangement before the runtime hides them.
 * `fixedLayout` skips the seeded shuffle — identical arrangement each round —
 * which is the low-variety end of the adaptive envelope.
 */
export function createMemoryRound({ seed, pairCount = 2, pool, fixedLayout = false }) {
  if (!Number.isInteger(seed) || seed < 0) throw new RangeError("seed must be a non-negative integer");
  if (!Number.isInteger(pairCount) || pairCount < 2 || pairCount > 3) throw new RangeError("pairCount must be 2 or 3");
  if (!Array.isArray(pool) || pool.length < pairCount || new Set(pool).size < pairCount) {
    throw new RangeError("pool must contain at least pairCount distinct item ids");
  }
  const random = mulberry32(seed);
  const chosen = shuffled([...pool], random).slice(0, pairCount);
  const flat = chosen.flatMap((itemId) => [itemId, itemId]);
  // Low-variety rounds interleave instead of shuffling: identical layout
  // every round, with each pair's two halves kept far apart.
  const ordered = fixedLayout ? [...chosen, ...chosen] : shuffled(flat, random);
  const tokens = ordered
    .map((itemId, index) => ({ index, itemId }));
  return Object.freeze({
    seed,
    pairCount,
    tokens,
    hidden: false,
    open: [],
    found: []
  });
}

/** Runtime-directed transition ending the witnessed phase. */
export function hideTokens(round) {
  if (round.hidden) throw new Error("tokens are already hidden");
  return Object.freeze({ ...round, hidden: true });
}

function isOpen(round, index) {
  return round.open.includes(index) || round.found.includes(index);
}

/**
 * Flips a token. Outcomes:
 * - "ignored": input cannot change anything right now (intro, locked pair,
 *   already-open token, two tokens already awaiting resolution).
 * - "first-open": one token revealed.
 * - "mismatched": two different tokens revealed; call closeMismatched.
 * - "matched": a pair locks open forever.
 */
export function flipToken(round, index) {
  if (!round.hidden) return { round, outcome: "ignored" };
  if (!Number.isInteger(index) || index < 0 || index >= round.tokens.length) {
    throw new RangeError(`token index out of range: ${index}`);
  }
  if (round.open.length >= 2 || isOpen(round, index)) return { round, outcome: "ignored" };

  const open = [...round.open, index];
  const next = { ...round, open };
  if (open.length === 1) return { round: Object.freeze(next), outcome: "first-open" };

  const firstId = round.tokens[open[0]].itemId;
  const secondId = round.tokens[open[1]].itemId;
  if (firstId === secondId) {
    return {
      round: Object.freeze({ ...next, open: [], found: [...round.found, ...open] }),
      outcome: "matched"
    };
  }
  return { round: Object.freeze(next), outcome: "mismatched" };
}

/** Closes whatever the child currently has flipped (non-penalizing reveal end). */
export function closeMismatched(round) {
  return Object.freeze({ ...round, open: [] });
}

export function isComplete(round) {
  return round.found.length === round.tokens.length;
}

export function tokenIdAt(round, index) {
  if (!Number.isInteger(index) || index < 0 || index >= round.tokens.length) {
    throw new RangeError(`token index out of range: ${index}`);
  }
  return round.tokens[index].itemId;
}
