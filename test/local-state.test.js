import test from "node:test";
import assert from "node:assert/strict";
import { clearLocalState, loadLocalState, saveLocalState } from "../src/local-state.js";

function memoryStorage() {
  const values = new Map();
  return {
    values,
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
}

test("bounded local state round-trips in a versioned envelope and clears deliberately", () => {
  const storage = memoryStorage();
  assert.equal(saveLocalState("world", { flowers: 3 }, storage), true);
  assert.deepEqual(loadLocalState("world", storage), { flowers: 3 });
  assert.equal(clearLocalState("world", storage), true);
  assert.equal(loadLocalState("world", storage), null);
});

test("malformed, incompatible, and oversized state safely falls back", () => {
  const storage = memoryStorage();
  storage.values.set("bad", "not json");
  storage.values.set("old", JSON.stringify({ version: 0, savedAt: Date.now(), value: {} }));
  storage.values.set("large", "x".repeat(100));
  assert.equal(loadLocalState("bad", storage), null);
  assert.equal(loadLocalState("old", storage), null);
  assert.equal(loadLocalState("large", storage, { maxBytes: 20 }), null);
  assert.equal(saveLocalState("large", { text: "x".repeat(100) }, storage, { maxBytes: 20 }), false);
});

test("restricted storage never prevents play", () => {
  const storage = {
    getItem: () => { throw new Error("restricted"); },
    setItem: () => { throw new Error("restricted"); },
    removeItem: () => { throw new Error("restricted"); },
  };
  assert.equal(loadLocalState("world", storage), null);
  assert.equal(saveLocalState("world", {}, storage), false);
  assert.equal(clearLocalState("world", storage), false);
});
