// Memory adaptive progression (Epic L2) — pure, versioned, minimal.
// Local gameplay state estimating how much of Memory's envelope seems useful
// right now. Never surfaced to the child; never an assessment of the child.

import { clearLocalState, loadLocalState, saveLocalState } from "./local-state.js";

export const MEMORY_ADAPTIVE_KEY = "supersimplegames.memory.adaptive";

export const ENRICH_THRESHOLD = 0.72;
export const SIMPLIFY_THRESHOLD = 0.45;
const ALPHA = 0.3;
const COMFORT_RATE = 0.28;

// Ordered enrichment path — each notch moves exactly one dimension one step.
// Simplification walks this list backwards (undo the newest change first).
const NOTCHES = Object.freeze([
  Object.freeze({ dim: "mismatchMs", from: 1050, to: 950 }),
  Object.freeze({ dim: "previewMs", from: 1900, to: 1650 }),
  Object.freeze({ dim: "pairs", from: 2, to: 3 }),
  Object.freeze({ dim: "variety", from: false, to: true }),
  Object.freeze({ dim: "mismatchMs", from: 950, to: 850 }),
  Object.freeze({ dim: "previewMs", from: 1650, to: 1400 }),
]);

const VALID_PREVIEW = Object.freeze([1900, 1650, 1400]);
const VALID_MISMATCH = Object.freeze([1050, 950, 850]);

export function defaultRecord() {
  return Object.freeze({
    version: 1,
    avg: 0.55,
    config: Object.freeze({ pairs: 2, previewMs: 1900, mismatchMs: 1050, variety: false }),
  });
}

/** Corrupt or partial records fall back to the whole minimum experience. */
export function sanitizeRecord(raw) {
  const base = defaultRecord();
  if (!raw || raw.version !== 1) return base;
  const avg = typeof raw.avg === "number" && Number.isFinite(raw.avg) ? Math.min(1, Math.max(0, raw.avg)) : null;
  const c = raw.config;
  const valid =
    c && Number.isInteger(c.pairs) && (c.pairs === 2 || c.pairs === 3) &&
    VALID_PREVIEW.includes(c.previewMs) && VALID_MISMATCH.includes(c.mismatchMs) &&
    typeof c.variety === "boolean";
  if (avg === null || !valid) return base;
  return Object.freeze({
    version: 1,
    avg,
    config: Object.freeze({ pairs: c.pairs, previewMs: c.previewMs, mismatchMs: c.mismatchMs, variety: c.variety }),
  });
}

export function loadMemoryAdaptive(storage) {
  return sanitizeRecord(loadLocalState(MEMORY_ADAPTIVE_KEY, storage));
}

export function saveMemoryAdaptive(record, storage) {
  return saveLocalState(MEMORY_ADAPTIVE_KEY, sanitizeRecord(record), storage);
}

export function clearMemoryAdaptive(storage) {
  return clearLocalState(MEMORY_ADAPTIVE_KEY, storage);
}

/** Round quality: share of flips that completed a pair. Abandoned rounds never reach this. */
export function scoreRound({ matches, mismatches }) {
  if (!Number.isInteger(matches) || matches < 1) throw new RangeError("matches must be a positive integer");
  if (!Number.isInteger(mismatches) || mismatches < 0) throw new RangeError("mismatches must be a non-negative integer");
  return matches / (matches + mismatches);
}

function enrich(config) {
  for (const notch of NOTCHES) {
    if (config[notch.dim] === notch.from && config[notch.dim] !== notch.to) {
      return { ...config, [notch.dim]: notch.to };
    }
  }
  return null;
}

function simplify(config) {
  for (let i = NOTCHES.length - 1; i >= 0; i -= 1) {
    const notch = NOTCHES[i];
    if (config[notch.dim] === notch.to) return { ...config, [notch.dim]: notch.from };
  }
  return null;
}

/**
 * Folds a completed round into the estimate and moves at most one notch.
 * Hysteresis keeps a dead zone so ordinary variance does not flap config.
 */
export function applyRound(record, score) {
  if (typeof score !== "number" || !(score >= 0 && score <= 1)) throw new RangeError("score must be within 0..1");
  const avg = Math.min(1, Math.max(0, record.avg + ALPHA * (score - record.avg)));
  let config = record.config;
  if (avg >= ENRICH_THRESHOLD) config = enrich(config) ?? config;
  else if (avg <= SIMPLIFY_THRESHOLD) config = simplify(config) ?? config;
  return Object.freeze({ version: 1, avg, config: Object.freeze(config) });
}

/**
 * What this round should actually serve: usually the current config, sometimes
 * one notch simpler (comfort variation). Comfort serving never persists.
 */
export function serveConfig(record, random = Math.random) {
  if (typeof random !== "function") throw new TypeError("random must be a function");
  const simpler = simplify(record.config);
  if (simpler && random() < COMFORT_RATE) {
    return Object.freeze({ config: Object.freeze(simpler), comfort: true });
  }
  return Object.freeze({ config: Object.freeze({ ...record.config }), comfort: false });
}
