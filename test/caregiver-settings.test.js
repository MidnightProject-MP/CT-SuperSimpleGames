import test from "node:test";
import assert from "node:assert/strict";
import {
  CAREGIVER_STORAGE_KEY,
  WORLD_IDS,
  defaultCaregiverSettings,
  loadCaregiverSettings,
  saveCaregiverSettings,
  visibleWorlds
} from "../src/caregiver-settings.js";

function memoryStorage(initial = new Map()) {
  return {
    getItem: (key) => initial.get(key) ?? null,
    setItem: (key, value) => initial.set(key, String(value))
  };
}

test("defaults on empty storage", () => {
  const defaults = defaultCaregiverSettings();

  assert.deepEqual([...WORLD_IDS], ["bloom", "color-splash", "peekaboo", "story-scenes", "memory", "numbers"]);
  assert.deepEqual(defaults, { version: 1, sessionMinutes: null, hiddenWorlds: [] });
  assert.equal(Object.isFrozen(defaults), true);
  assert.deepEqual(loadCaregiverSettings(memoryStorage()), defaults);
});

test("save/load round-trips valid settings", () => {
  const values = new Map();
  const storage = memoryStorage(values);
  const settings = { version: 1, sessionMinutes: 15, hiddenWorlds: ["bloom", "story-scenes"] };

  assert.equal(saveCaregiverSettings(settings, storage), true);
  assert.deepEqual(JSON.parse(values.get(CAREGIVER_STORAGE_KEY)), settings);
  assert.deepEqual(loadCaregiverSettings(storage), settings);
});

test("malformed JSON falls back to defaults", () => {
  const storage = memoryStorage(new Map([[CAREGIVER_STORAGE_KEY, "{not json"]]));

  assert.deepEqual(loadCaregiverSettings(storage), defaultCaregiverSettings());
});

test("each invalid field is sanitized to its default", () => {
  const cases = [
    [{ version: 99 }, { version: 1, sessionMinutes: null, hiddenWorlds: [] }],
    [{ sessionMinutes: 4.5 }, { version: 1, sessionMinutes: null, hiddenWorlds: [] }],
    [{ sessionMinutes: "15" }, { version: 1, sessionMinutes: null, hiddenWorlds: [] }],
    [{ sessionMinutes: 61 }, { version: 1, sessionMinutes: null, hiddenWorlds: [] }],
    [{ hiddenWorlds: "bloom" }, { version: 1, sessionMinutes: null, hiddenWorlds: [] }]
  ];

  for (const [raw, expected] of cases) {
    const storage = memoryStorage(new Map([[CAREGIVER_STORAGE_KEY, JSON.stringify(raw)]]));
    assert.deepEqual(loadCaregiverSettings(storage), expected, JSON.stringify(raw));
  }
});

test("valid fields survive sanitization and hidden worlds dedupe to world ids", () => {
  const raw = { version: 1, sessionMinutes: 30, hiddenWorlds: ["peekaboo", "nope", 7, "peekaboo"] };
  const storage = memoryStorage(new Map([[CAREGIVER_STORAGE_KEY, JSON.stringify(raw)]]));

  assert.deepEqual(loadCaregiverSettings(storage), { version: 1, sessionMinutes: 30, hiddenWorlds: ["peekaboo"] });
});

test("retired fields and worlds are dropped from stored settings", () => {
  const raw = { version: 1, level: "gentle", sessionMinutes: 20, hiddenWorlds: ["stack-settle"] };
  const storage = memoryStorage(new Map([[CAREGIVER_STORAGE_KEY, JSON.stringify(raw)]]));

  assert.deepEqual(
    loadCaregiverSettings(storage),
    { version: 1, sessionMinutes: 20, hiddenWorlds: [] }
  );
});

test("saving sanitizes before persisting", () => {
  const values = new Map();
  const storage = memoryStorage(values);

  assert.equal(saveCaregiverSettings({ version: 3, sessionMinutes: 999, hiddenWorlds: ["stack-settle"] }, storage), true);
  assert.deepEqual(JSON.parse(values.get(CAREGIVER_STORAGE_KEY)), { version: 1, sessionMinutes: null, hiddenWorlds: [] });
});

test("restricted storage remains harmless", () => {
  const storage = {
    getItem: () => { throw new Error("restricted"); },
    setItem: () => { throw new Error("restricted"); }
  };

  assert.deepEqual(loadCaregiverSettings(storage), defaultCaregiverSettings());
  assert.equal(saveCaregiverSettings(defaultCaregiverSettings(), storage), false);
});

test("a restricted localStorage getter cannot prevent startup", () => {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    get: () => { throw new Error("restricted"); }
  });

  try {
    assert.deepEqual(loadCaregiverSettings(), defaultCaregiverSettings());
    assert.equal(saveCaregiverSettings(defaultCaregiverSettings()), false);
  } finally {
    if (descriptor) Object.defineProperty(globalThis, "localStorage", descriptor);
    else delete globalThis.localStorage;
  }
});

test("visibleWorlds filters hidden worlds and preserves world order", () => {
  assert.deepEqual(visibleWorlds(defaultCaregiverSettings()), [...WORLD_IDS]);
  assert.deepEqual(
    visibleWorlds({ hiddenWorlds: ["story-scenes", "bloom", "story-scenes"] }),
    ["color-splash", "peekaboo", "memory", "numbers"]
  );
  assert.deepEqual(visibleWorlds({}), [...WORLD_IDS]);
  assert.deepEqual(visibleWorlds({ hiddenWorlds: [...WORLD_IDS] }), []);
});
