import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { POCKET_ITEMS, getPocketItem } from "../src/pocket-items.js";
import { ITEM_CATALOG, PATTERN_CATALOG } from "../src/pockets.js";

test("every generated pocket item has complete presentation metadata", () => {
  assert.deepEqual(Object.keys(POCKET_ITEMS).sort(), [...ITEM_CATALOG].sort());
  for (const id of ITEM_CATALOG) {
    const item = getPocketItem(id);
    assert.equal(typeof item.name, "string");
    assert.ok(item.name.length > 0);
    assert.equal(item.artId, `friend-${id}`);
    assert.equal(Number.isFinite(item.tone), true);
    assert.ok(item.tone > 0);
    assert.equal(Object.isFrozen(item), true);
  }
  assert.equal(Object.isFrozen(POCKET_ITEMS), true);
});

test("every pocket item has a local vector illustration", () => {
  const sprite = readFileSync(resolve(import.meta.dirname, "../assets/pocket-friends.svg"), "utf8");
  for (const id of ITEM_CATALOG) {
    assert.match(sprite, new RegExp(`id=["']friend-${id}["']`), `${id} has no vector symbol`);
  }
});

test("unknown pocket items are rejected", () => {
  assert.throws(() => getPocketItem("missing"), RangeError);
});

test("every generated pocket pattern has a visual treatment", () => {
  const css = readFileSync(resolve(import.meta.dirname, "../peekaboo.css"), "utf8");
  for (const pattern of PATTERN_CATALOG) {
    assert.match(css, new RegExp(`data-pattern=["']${pattern}["']`), `${pattern} has no CSS pattern`);
  }
});
