import test from "node:test";
import assert from "node:assert/strict";
import {
  ENRICH_THRESHOLD,
  SIMPLIFY_THRESHOLD,
  applyRound,
  clearMemoryAdaptive,
  defaultRecord,
  loadMemoryAdaptive,
  sanitizeRecord,
  saveMemoryAdaptive,
  scoreRound,
  serveConfig
} from "../src/memory-adaptive.js";

function memoryStorage(initial = new Map()) {
  return {
    getItem: (key) => initial.get(key) ?? null,
    setItem: (key, value) => initial.set(key, String(value)),
    removeItem: (key) => initial.delete(key)
  };
}

test("the default record starts at minimum experience mid-dead-zone", () => {
  const record = defaultRecord();
  assert.equal(record.version, 1);
  assert.equal(record.avg, 0.55);
  assert.deepEqual(
    record.config,
    { pairs: 2, previewMs: 1900, mismatchMs: 1050, variety: false }
  );
});

test("sanitize falls back to defaults on corrupt or partial records", () => {
  const base = defaultRecord();
  const corrupt = [
    null, undefined, {}, { version: 2 }, { version: 1 },
    { version: 1, avg: "high" },
    { version: 1, avg: 0.5, config: { pairs: 5, previewMs: 1900, mismatchMs: 1050, variety: false } },
    { version: 1, avg: 0.5, config: { pairs: 2, previewMs: 999, mismatchMs: 1050, variety: false } },
    { version: 1, avg: 0.5, config: { pairs: 2, previewMs: 1900, mismatchMs: 1050 } }
  ];
  for (const raw of corrupt) {
    assert.deepEqual(sanitizeRecord(raw), base, JSON.stringify(raw));
  }
});

test("a valid record survives sanitization and clamps runaway averages", () => {
  const raw = { version: 1, avg: 7, config: { pairs: 3, previewMs: 1400, mismatchMs: 850, variety: true } };
  const clean = sanitizeRecord(raw);
  assert.equal(clean.avg, 1);
  assert.deepEqual(clean.config, { pairs: 3, previewMs: 1400, mismatchMs: 850, variety: true });
});

test("round quality is the share of flips that completed pairs", () => {
  assert.equal(scoreRound({ matches: 2, mismatches: 0 }), 1);
  assert.equal(scoreRound({ matches: 2, mismatches: 2 }), 0.5);
  assert.equal(scoreRound({ matches: 3, mismatches: 1 }), 0.75);
  assert.throws(() => scoreRound({ matches: 0, mismatches: 0 }));
  assert.throws(() => scoreRound({ matches: -1, mismatches: 0 }));
  assert.throws(() => scoreRound({ matches: 2, mismatches: 1.5 }));
});

test("a single strong round moves evidence gradually, staying in the dead zone", () => {
  let record = defaultRecord();
  record = applyRound(record, 1);
  assert.ok(record.avg > 0.55 && record.avg < ENRICH_THRESHOLD, `avg drifted too fast: ${record.avg}`);
  assert.deepEqual(record.config, defaultRecord().config);
});

test("sustained fluency enriches exactly one notch at a time, in documented order", () => {
  const expectedPath = [
    { pairs: 2, previewMs: 1900, mismatchMs: 950, variety: false },
    { pairs: 2, previewMs: 1650, mismatchMs: 950, variety: false },
    { pairs: 3, previewMs: 1650, mismatchMs: 950, variety: false },
    { pairs: 3, previewMs: 1650, mismatchMs: 950, variety: true },
    { pairs: 3, previewMs: 1650, mismatchMs: 850, variety: true },
    { pairs: 3, previewMs: 1400, mismatchMs: 850, variety: true }
  ];

  let record = defaultRecord();
  const seen = [];
  let previous = record.config;
  let guard = 0;
  while (seen.length < expectedPath.length && guard < 200) {
    guard += 1;
    record = applyRound(record, 1);
    if (JSON.stringify(record.config) !== JSON.stringify(previous)) {
      seen.push(record.config);
      previous = record.config;
    }
  }
  assert.deepEqual(seen, expectedPath);

  // Saturated: more strength changes nothing.
  const saturated = record.config;
  for (let i = 0; i < 10; i += 1) record = applyRound(record, 1);
  assert.deepEqual(record.config, saturated);
});

test("the dead zone holds configuration steady through ordinary variance", () => {
  let record = defaultRecord();
  const startConfig = record.config;
  for (const score of [0.6, 0.5, 0.6, 0.55, 0.6]) {
    record = applyRound(record, score);
    assert.ok(record.avg > SIMPLIFY_THRESHOLD && record.avg < ENRICH_THRESHOLD);
    assert.deepEqual(record.config, startConfig);
  }
});

test("confusion simplifies newest-first and never below minimum", () => {
  let record = sanitizeRecord({
    version: 1,
    avg: 0.8,
    config: { pairs: 3, previewMs: 1400, mismatchMs: 850, variety: true }
  });

  record = applyRound(record, 0); // 0.8 -> 0.56, still dead zone
  assert.deepEqual(record.config, { pairs: 3, previewMs: 1400, mismatchMs: 850, variety: true });
  record = applyRound(record, 0); // -> 0.392, simplify fires: newest notch undone
  assert.deepEqual(record.config, { pairs: 3, previewMs: 1650, mismatchMs: 850, variety: true });

  for (let i = 0; i < 30; i += 1) record = applyRound(record, 0);
  assert.deepEqual(record.config, { pairs: 2, previewMs: 1900, mismatchMs: 1050, variety: false });
});

test("comfort serving steps one notch simpler without persisting", () => {
  const record = sanitizeRecord({
    version: 1,
    avg: 0.9,
    config: { pairs: 3, previewMs: 1650, mismatchMs: 850, variety: true }
  });

  const comfort = serveConfig(record, () => 0);
  assert.equal(comfort.comfort, true);
  assert.deepEqual(comfort.config, { pairs: 3, previewMs: 1650, mismatchMs: 950, variety: true });
  assert.deepEqual(record.config, { pairs: 3, previewMs: 1650, mismatchMs: 850, variety: true }, "comfort must not mutate");

  const plain = serveConfig(record, () => 0.99);
  assert.equal(plain.comfort, false);
  assert.deepEqual(plain.config, record.config);

  const min = defaultRecord();
  const minServe = serveConfig(min, () => 0);
  assert.deepEqual(minServe.config, min.config, "nothing simpler than minimum exists");
});

test("records persist through storage and reset cleanly", () => {
  const store = memoryStorage();
  let record = defaultRecord();
  for (let i = 0; i < 12; i += 1) record = applyRound(record, 1);

  assert.equal(saveMemoryAdaptive(record, store), true);
  assert.deepEqual(loadMemoryAdaptive(store), record);

  assert.equal(clearMemoryAdaptive(store), true);
  assert.deepEqual(loadMemoryAdaptive(store), defaultRecord());
});
