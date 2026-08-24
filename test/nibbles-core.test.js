import test from "node:test";
import assert from "node:assert/strict";
import {
  createSpawnPlan,
  NUMBER_CHOICES_DEFAULT,
  NUMBER_CHOICES_RICH,
  toneFor
} from "../src/nibbles-core.js";

test("level choices stay tiny by default and widen only for rich", () => {
  assert.deepEqual([...NUMBER_CHOICES_DEFAULT], [1, 2, 3]);
  assert.deepEqual([...NUMBER_CHOICES_RICH], [1, 2, 3, 4, 5]);
});

test("spawn plans are deterministic for a seed", () => {
  const first = createSpawnPlan({ count: 3, seed: 9 });
  const second = createSpawnPlan({ count: 3, seed: 9 });
  assert.deepEqual(first, second);
});

test("plans place every friend inside the scene without crowding", () => {
  for (const count of NUMBER_CHOICES_RICH) {
    const plan = createSpawnPlan({ count, seed: count * 31 + 7 });
    assert.equal(plan.length, count);
    for (const spot of plan) {
      assert.ok(spot.x >= 0.09 && spot.x <= 0.91, `x out of bounds: ${spot.x}`);
      assert.ok(spot.y >= 0.13 && spot.y <= 0.83, `y out of bounds: ${spot.y}`);
    }
    for (let a = 0; a < plan.length; a += 1) {
      for (let b = a + 1; b < plan.length; b += 1) {
        const distance = Math.hypot(plan[a].x - plan[b].x, plan[a].y - plan[b].y);
        assert.ok(distance > 0.12, `friends ${a} and ${b} crowd together (${distance})`);
      }
    }
    const orders = new Set(plan.map((spot) => spot.order));
    assert.equal(orders.size, count);
    for (const order of orders) assert.ok(Number.isInteger(order) && order >= 0 && order < count);
  }
});

test("different seeds vary the arrangement across a sweep", () => {
  const layouts = new Set();
  for (let seed = 0; seed < 24; seed += 1) {
    const plan = createSpawnPlan({ count: 3, seed });
    layouts.add(plan.map((spot) => `${spot.x.toFixed(2)},${spot.y.toFixed(2)}`).join("|"));
  }
  assert.ok(layouts.size > 6, `only ${layouts.size} distinct layouts in 24 seeds`);
});

test("invalid counts and seeds are rejected", () => {
  for (const bad of [0, -1, 1.5, 6]) {
    assert.throws(() => createSpawnPlan({ count: bad, seed: 1 }));
    assert.throws(() => validateCountShim(bad));
  }
  assert.throws(() => createSpawnPlan({ count: 2, seed: -4 }));
  function validateCountShim(value) { return createSpawnPlan({ count: value, seed: 1 }); }
});

test("tones rise with arrival order so groups count themselves aloud", () => {
  const tones = [];
  for (let order = 0; order < NUMBER_CHOICES_RICH.length; order += 1) tones.push(toneFor(order));
  for (let i = 1; i < tones.length; i += 1) assert.ok(tones[i] > tones[i - 1]);
  assert.throws(() => toneFor(-1));
  assert.throws(() => toneFor(5.5));
});
