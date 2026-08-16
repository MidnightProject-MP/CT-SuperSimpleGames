import test from "node:test";
import assert from "node:assert/strict";
import { createPointerSampler } from "../src/interaction.js";

test("drag samples are throttled independently for each pointer", () => {
  const sampler = createPointerSampler(150);
  sampler.start(1, 0);
  sampler.start(2, 10);

  assert.equal(sampler.sample(1, 149), false);
  assert.equal(sampler.sample(2, 159), false);
  assert.equal(sampler.sample(1, 150), true);
  assert.equal(sampler.sample(2, 160), true);
});

test("ending a pointer removes its sampling state", () => {
  const sampler = createPointerSampler();
  sampler.start(7, 0);
  assert.equal(sampler.size, 1);

  sampler.end(7);
  assert.equal(sampler.size, 0);
  assert.equal(sampler.sample(7, 1000), false);
});

test("clearing removes all active pointers", () => {
  const sampler = createPointerSampler();
  sampler.start(1, 0);
  sampler.start(2, 0);
  sampler.clear();

  assert.equal(sampler.size, 0);
});
