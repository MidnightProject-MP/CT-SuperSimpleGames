import test from "node:test";
import assert from "node:assert/strict";
import { COLORS, MAX_BLOOMS, clampPosition, createBloom, trimToLimit } from "../src/game.js";

test("clampPosition keeps a bloom fully inside the viewport", () => {
  assert.deepEqual(clampPosition(-20, 900, 320, 640, 50), { x: 50, y: 590 });
});

test("createBloom cycles colors and varies size and petal count predictably", () => {
  const first = createBloom(0, 160, 320, 320, 640);
  const wrapped = createBloom(COLORS.length, 160, 320, 320, 640);

  assert.equal(first.color.name, "pink");
  assert.equal(wrapped.color.name, "pink");
  assert.ok(first.size >= 92 && first.size <= 140);
  assert.ok(first.petals >= 5 && first.petals <= 8);
});

test("trimToLimit retains the newest blooms", () => {
  const blooms = Array.from({ length: MAX_BLOOMS + 3 }, (_, id) => ({ id }));
  const trimmed = trimToLimit(blooms);

  assert.equal(trimmed.length, MAX_BLOOMS);
  assert.equal(trimmed[0].id, 3);
  assert.equal(trimmed.at(-1).id, MAX_BLOOMS + 2);
});
