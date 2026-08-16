import test from "node:test";
import assert from "node:assert/strict";
import {
  BLOOM_STAGES,
  COLORS,
  MAX_BLOOMS,
  NEIGHBOR_DISTANCE,
  clampPosition,
  createBloom,
  growBloom,
  gardenNeighborhoods,
  nearestBloom,
  neighborDistanceForLayout,
  planGardenInteraction,
  trimToLimit
} from "../src/game.js";

test("clampPosition keeps a bloom fully inside the viewport", () => {
  assert.deepEqual(clampPosition(-20, 900, 320, 640, 50), { x: 50, y: 590 });
});

test("garden neighborhoods deterministically expose harmony, alternation, and mature canopies", () => {
  const blooms = [
    { ...createBloom(0, 100, 100, 500, 500), stage: 2 },
    { ...createBloom(COLORS.length, 180, 100, 500, 500), stage: 2 },
    { ...createBloom(1, 140, 165, 500, 500), stage: 2 },
    { ...createBloom(2, 450, 450, 500, 500), stage: 2 }
  ];
  const result = gardenNeighborhoods(blooms, 120);
  assert.ok(result.links.some(({ first, second, type }) => first === 0 && second === COLORS.length && type === "harmony"));
  assert.ok(result.links.some(({ type }) => type === "alternating"));
  assert.deepEqual(result.canopies[0].ids, [0, 1, COLORS.length]);
  assert.deepEqual(gardenNeighborhoods([...blooms].reverse(), 120), result);
});

test("garden neighborhood effects obey explicit budgets", () => {
  const blooms = Array.from({ length: 12 }, (_, index) => ({ ...createBloom(index, 200, 200, 500, 500), stage: 2 }));
  const result = gardenNeighborhoods(blooms, 200, { maxLinks: 7, maxCanopies: 2 });
  assert.equal(result.links.length, 7);
  assert.equal(result.canopies.length, 2);
  assert.throws(() => gardenNeighborhoods(blooms, 0), RangeError);
});

test("createBloom cycles colors and varies size and petal count predictably", () => {
  const first = createBloom(0, 160, 320, 320, 640);
  const wrapped = createBloom(COLORS.length, 160, 320, 320, 640);

  assert.equal(first.color.name, "pink");
  assert.equal(wrapped.color.name, "pink");
  assert.ok(first.size >= 92 && first.size <= 140);
  assert.ok(first.petals >= 5 && first.petals <= 8);
  assert.equal(first.stage, 0);
  assert.equal(first.baseSize, first.size);
  assert.equal(first.visits, 0);
});

test("trimToLimit retains the newest blooms", () => {
  const blooms = Array.from({ length: MAX_BLOOMS + 3 }, (_, id) => ({ id }));
  const trimmed = trimToLimit(blooms);

  assert.equal(trimmed.length, MAX_BLOOMS);
  assert.equal(trimmed[0].id, 3);
  assert.equal(trimmed.at(-1).id, MAX_BLOOMS + 2);
});

test("nearestBloom finds a nearby relation and respects exclusions", () => {
  const items = [
    { id: 1, x: 10, y: 10 },
    { id: 2, x: 80, y: 10 },
    { id: 3, x: 200, y: 10 }
  ];
  assert.equal(nearestBloom(items, 70, 12, { maxDistance: NEIGHBOR_DISTANCE }).id, 2);
  assert.equal(nearestBloom(items, 70, 12, { excludeId: 2, maxDistance: 70 }).id, 1);
  assert.equal(nearestBloom(items, 500, 500, { maxDistance: 40 }), null);
});

test("growBloom advances a bounded circular lifecycle without mutating prior state", () => {
  const original = { id: 1, x: 8, y: 8, size: 100, baseSize: 100, stage: 0, visits: 0 };
  const grown = growBloom(original, { step: 20, maxSize: 130, width: 320, height: 640 });
  const capped = growBloom(grown, { step: 20, maxSize: 130, width: 320, height: 640 });
  assert.deepEqual(original, { id: 1, x: 8, y: 8, size: 100, baseSize: 100, stage: 0, visits: 0 });
  assert.equal(grown.size, 120);
  assert.equal(grown.stage, 1);
  assert.equal(grown.visits, 1);
  assert.ok(grown.x > original.x && grown.y > original.y);
  assert.equal(capped.size, 130);
  assert.equal(capped.stage, 2);
  assert.equal(capped.visits, 2);

  let cycled = original;
  for (let index = 0; index < BLOOM_STAGES.length; index += 1) cycled = growBloom(cycled);
  assert.equal(cycled.stage, 0);
  assert.equal(cycled.size, original.baseSize);
  assert.equal(cycled.visits, BLOOM_STAGES.length);
});

test("garden neighbor reach follows the shorter physical layout dimension", () => {
  assert.equal(neighborDistanceForLayout(320, 640), 120);
  assert.equal(neighborDistanceForLayout(800, 320), 120);
  assert.equal(neighborDistanceForLayout(500, 500), 170);
  assert.equal(neighborDistanceForLayout(1200, 900), 190);
  assert.throws(() => neighborDistanceForLayout(0, 500), RangeError);
});

test("garden interactions create below the cap and revisit without erasing at the cap", () => {
  const blooms = [
    { id: 1, x: 20, y: 20 },
    { id: 2, x: 200, y: 200 }
  ];
  assert.deepEqual(planGardenInteraction(blooms, 90, 90, { limit: 3 }), {
    action: "create", x: 90, y: 90
  });
  assert.deepEqual(planGardenInteraction(blooms, 190, 190, { limit: 2 }), {
    action: "revisit", id: 2
  });
  assert.deepEqual(planGardenInteraction(blooms, 90, 90, { targetId: 1, limit: 3 }), {
    action: "revisit", id: 1
  });
});
