import test from "node:test";
import assert from "node:assert/strict";
import { SOUND_STORAGE_KEY, loadSoundPreference, saveSoundPreference } from "../src/settings.js";

test("sound defaults on and persists a shared preference", () => {
  const values = new Map();
  const storage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value)
  };

  assert.equal(loadSoundPreference(storage), true);
  assert.equal(saveSoundPreference(false, storage), true);
  assert.equal(values.get(SOUND_STORAGE_KEY), "false");
  assert.equal(loadSoundPreference(storage), false);
});

test("restricted storage remains harmless", () => {
  const storage = {
    getItem: () => { throw new Error("restricted"); },
    setItem: () => { throw new Error("restricted"); }
  };

  assert.equal(loadSoundPreference(storage), true);
  assert.equal(saveSoundPreference(false, storage), false);
});

test("a restricted localStorage getter cannot prevent startup", () => {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    get: () => { throw new Error("restricted"); }
  });

  try {
    assert.equal(loadSoundPreference(), true);
    assert.equal(saveSoundPreference(false), false);
  } finally {
    if (descriptor) Object.defineProperty(globalThis, "localStorage", descriptor);
    else delete globalThis.localStorage;
  }
});

test("an existing Bloom mute preference remains respected", () => {
  const storage = {
    getItem: (key) => key === "bloom.sound-enabled" ? "false" : null
  };

  assert.equal(loadSoundPreference(storage), false);
});
