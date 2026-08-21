import test from "node:test";
import assert from "node:assert/strict";
import {
  BLOOM_STAGES,
  BLOOM_TIERS,
  COLORS,
  MAX_BLOOMS,
  GARDEN_VISITOR_TOUCHES,
  MAX_BLOOM_TIER,
  NEIGHBOR_DISTANCE,
  clampPosition,
  createBloom,
  growBloom,
  gardenNeighborhoods,
  gardenVisitorFor,
  isRainbowTree,
  nearestBloom,
  neighborDistanceForLayout,
  planBloomPull,
  planBloomSettle,
  planBouquetGather,
  planTreeDissolution,
  planGardenInteraction,
  planGardenMerge,
  restoreGardenState,
  serializeGardenState,
  moveGardenVisitor,
  trimToLimit
} from "../src/game.js";

test("a garden snapshot uses normalized positions and restores current bloom definitions", () => {
  let bloom = createBloom(2, 200, 300, 400, 600);
  bloom = growBloom(bloom, { width: 400, height: 600 });
  const saved = serializeGardenState([bloom], 3, 400, 600);
  assert.equal(saved.blooms[0].x, 0.5);
  assert.equal(saved.blooms[0].color, "orange");
  const restored = restoreGardenState(JSON.parse(JSON.stringify(saved)), 800, 1200);
  assert.equal(restored.nextId, 3);
  assert.equal(restored.blooms[0].x, 400);
  assert.equal(restored.blooms[0].stage, 1);
  assert.equal(restored.blooms[0].color, COLORS[2]);
});

test("garden restoration rejects malformed, duplicate, and unbounded snapshots", () => {
  const saved = serializeGardenState([createBloom(0, 100, 100, 500, 500)], 1, 500, 500);
  assert.throws(() => restoreGardenState({ ...saved, nextId: 0 }, 500, 500), RangeError);
  assert.throws(() => restoreGardenState({ ...saved, blooms: [saved.blooms[0], saved.blooms[0]] }, 500, 500), TypeError);
  assert.throws(() => restoreGardenState({ ...saved, blooms: Array(MAX_BLOOMS + 1).fill(saved.blooms[0]) }, 500, 500), RangeError);
});

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

test("stable garden conditions invite one deterministic visitor", () => {
  const mature = [
    { ...createBloom(0, 100, 120, 500, 500), stage: 2 },
    { ...createBloom(1, 170, 120, 500, 500), stage: 2 },
    { ...createBloom(2, 135, 180, 500, 500), stage: 2 },
  ];
  const bee = gardenVisitorFor(mature, 120);
  assert.equal(bee.type, "bee");
  assert.deepEqual(bee.anchorIds, [0, 1, 2]);
  assert.equal(Object.isFrozen(bee), true);

  const seed = [{ ...createBloom(4, 200, 220, 500, 500), stage: 3 }];
  assert.equal(gardenVisitorFor(seed, 120).type, "bird");

  const spaced = [createBloom(5, 100, 200, 500, 500), createBloom(6, 220, 200, 500, 500)];
  assert.equal(gardenVisitorFor(spaced, 120).type, "butterfly");
  assert.equal(gardenVisitorFor([createBloom(7, 100, 100, 500, 500)], 120), null);
});

test("garden visitors move locally within bounds and have a short visit", () => {
  const visitor = { type: "bee", x: 300, y: 300 };
  assert.deepEqual(moveGardenVisitor(visitor, 1, 320, 400), { x: 278, y: 282 });
  assert.deepEqual(moveGardenVisitor({ ...visitor, x: 4, y: 4 }, 2, 320, 400), { x: 42, y: 42 });
  assert.equal(GARDEN_VISITOR_TOUCHES, 4);
  assert.throws(() => moveGardenVisitor(visitor, -1, 320, 400), RangeError);
});

test("createBloom cycles colors and varies size and petal count predictably", () => {
  const first = createBloom(0, 160, 320, 320, 640);
  const wrapped = createBloom(COLORS.length, 160, 320, 320, 640);

  assert.equal(first.color.name, "pink");
  assert.equal(wrapped.color.name, "pink");
  assert.ok(first.size >= 92 && first.size <= 140);
  assert.ok(first.petals >= 5 && first.petals <= 8);
  assert.equal(first.stage, 0);
  assert.equal(first.tier, 0);
  assert.equal(first.mergedCount, 1);
  assert.deepEqual(first.sourceIds, [0]);
  assert.equal(first.baseSize, first.size);
  assert.equal(first.visits, 0);
});

test("three nearby peers merge into a bounded new garden tier", () => {
  const flowers = [
    createBloom(0, 180, 200, 500, 500),
    createBloom(COLORS.length, 240, 200, 500, 500),
    createBloom(COLORS.length * 2, 210, 250, 500, 500),
  ];
  const bouquet = planGardenMerge(flowers, 90, { width: 500, height: 500 });
  assert.deepEqual(bouquet.ids, [0, COLORS.length, COLORS.length * 2]);
  assert.equal(bouquet.bloom.tier, 1);
  assert.equal(bouquet.bloom.mergedCount, 3);
  assert.deepEqual(bouquet.bloom.sourceIds, [0, COLORS.length, COLORS.length * 2]);
  assert.equal(BLOOM_TIERS[bouquet.bloom.tier].name, "bouquet");
  assert.equal(Object.isFrozen(bouquet.bloom), true);

  const bouquets = [
    bouquet.bloom,
    { ...bouquet.bloom, id: 5, x: 270, sourceIds: Object.freeze([3, 4, 5]) },
    { ...bouquet.bloom, id: 8, x: 225, y: 270, sourceIds: Object.freeze([6, 7, 8]) },
  ];
  const tree = planGardenMerge(bouquets, 100, { width: 500, height: 500 });
  assert.equal(tree.bloom.tier, MAX_BLOOM_TIER);
  assert.equal(tree.bloom.mergedCount, 9);
  assert.equal(BLOOM_TIERS[tree.bloom.tier].name, "tree");
  assert.equal(planGardenMerge([tree.bloom, tree.bloom, tree.bloom], 100), null);
});

test("garden merging requires three mutually nearby objects of one tier", () => {
  const flowers = [
    createBloom(0, 80, 80, 500, 500),
    createBloom(1, 140, 80, 500, 500),
    createBloom(2, 400, 400, 500, 500),
  ];
  assert.equal(planGardenMerge(flowers, 90), null);
  assert.equal(planGardenMerge([flowers[0], flowers[1], { ...flowers[2], x: 110, y: 130, tier: 1 }], 90), null);
  const mixed = planGardenMerge([
    flowers[0],
    { ...flowers[1], x: 110, y: 80 },
    { ...flowers[2], x: 100, y: 130 },
  ], 90);
  assert.equal(mixed.bloom.tier, 1);
  assert.deepEqual([...mixed.bloom.colors], ["orange", "pink", "purple"]);
  assert.throws(() => planGardenMerge(flowers, 0), RangeError);
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

test("tending pulls a flower toward its nearest matching-color kin wherever it is", () => {
  const pink = COLORS[0];
  const mover = { ...createBloom(0, 100, 100, 500, 500), color: pink };
  const nearOther = { ...createBloom(1, 110, 105, 500, 500), color: COLORS[1] };
  const kin = { ...createBloom(COLORS.length, 300, 100, 500, 500), color: pink };
  const pulled = planBloomPull(mover, [mover, nearOther, kin], { step: 18 });
  assert.equal(pulled.x, 118);
  assert.equal(pulled.y, 100);
  const distantKin = { ...kin, x: 450, y: 400 };
  const traveled = planBloomPull(mover, [mover, distantKin], {});
  const moved = Math.hypot(traveled.x - mover.x, traveled.y - mover.y);
  assert.ok(moved > 40 && moved <= 60.001);
  const settled = planBloomPull({ ...mover, x: 270, y: 100 }, [{ ...kin, x: 300, y: 100 }], {});
  assert.equal(settled, null);
});

test("tending pulls a bouquet toward the nearest bouquet of any color, never a flower or tree", () => {
  const bouquet = { ...createBloom(0, 100, 100, 500, 500), tier: 1, size: 150, baseSize: 150 };
  const flower = { ...createBloom(1, 115, 100, 500, 500) };
  const otherBouquet = { ...createBloom(2, 260, 100, 500, 500), tier: 1, size: 150, baseSize: 150 };
  const tree = { ...otherBouquet, id: 3, tier: 2, x: 130, y: 100 };
  const pulled = planBloomPull(bouquet, [bouquet, flower, otherBouquet, tree], { step: 18 });
  assert.equal(pulled.x, 118);
  assert.equal(planBloomPull(tree, [tree, bouquet], {}), null);
});

test("planBloomPull validates blooms and step", () => {
  const bloom = createBloom(0, 100, 100, 500, 500);
  assert.throws(() => planBloomPull(null, [bloom], {}), TypeError);
  assert.throws(() => planBloomPull(bloom, [bloom], { step: -1 }), RangeError);
  assert.throws(() => planBloomPull(bloom, [{ ...bloom, x: Number.NaN }], {}), TypeError);
});

test("a fresh bloom planted within reach of two matching kin settles between them", () => {
  const pink = COLORS[0];
  const pair = [
    { ...createBloom(0, 100, 100, 500, 500), color: pink },
    { ...createBloom(COLORS.length, 180, 100, 500, 500), color: pink }
  ];
  const fresh = { ...createBloom(20, 150, 130, 500, 500), color: pink };
  const settled = planBloomSettle(fresh, [...pair, fresh], { reach: 120 });
  assert.equal(settled.x, 140);
  assert.equal(settled.y, 100);
  const lone = [{ ...createBloom(5, 400, 400, 500, 500), color: pink }];
  assert.equal(planBloomSettle(fresh, lone, { reach: 120 }), null);
});

test("a newly formed bouquet settles toward its nearest bouquet neighbour", () => {
  const bouquet = { ...createBloom(0, 100, 100, 500, 500), tier: 1, size: 150, baseSize: 150 };
  const friend = { ...createBloom(1, 400, 100, 500, 500), tier: 1, size: 150, baseSize: 150 };
  const gathered = planBouquetGather({ ...bouquet }, [bouquet, friend], { reach: 120 });
  assert.equal(gathered.x, 304);
  assert.equal(gathered.y, 100);
  const farFriend = { ...friend, x: 700, y: 700 };
  assert.equal(planBouquetGather({ ...bouquet }, [bouquet, farFriend], { reach: 120 }), null);
  assert.equal(planBouquetGather({ ...createBloom(9, 100, 100, 500, 500) }, [], { reach: 120 }), null);
});

test("three nearby flowering trees dissolve together and two never do", () => {
  const tree = (id, x, y) => ({ ...createBloom(id, x, y, 600, 600), tier: 2, size: 164, baseSize: 164 });
  const trio = [tree(1, 100, 100), tree(2, 180, 100), tree(3, 130, 190)];
  assert.deepEqual(planTreeDissolution([...trio, tree(4, 500, 500)], { distance: 120 }), [1, 2, 3]);
  assert.equal(planTreeDissolution(trio.slice(0, 2), { distance: 120 }), null);
  const spread = [tree(1, 100, 100), tree(2, 400, 100), tree(3, 250, 300)];
  assert.equal(planTreeDissolution(spread, { distance: 120 }), null);
});

test("any three nearby flowers merge, and a tree spanning every color is a rainbow tree", () => {
  const differentFlowers = [
    createBloom(0, 100, 100, 500, 500),
    createBloom(1, 180, 100, 500, 500),
    createBloom(2, 140, 165, 500, 500)
  ];
  const bouquetPlan = planGardenMerge(differentFlowers, 120);
  assert.equal(bouquetPlan.bloom.tier, 1);
  assert.equal(bouquetPlan.bloom.mergedCount, 3);
  assert.deepEqual([...bouquetPlan.bloom.colors], ["orange", "pink", "purple"]);
  const bouquets = [
    { ...bouquetPlan.bloom },
    { ...createBloom(7, 240, 130, 500, 500), tier: 1, size: 150, baseSize: 150, petals: 9, mergedCount: 3, sourceIds: [7, 8, 9], colors: ["purple", "red"] },
    { ...createBloom(10, 180, 215, 500, 500), tier: 1, size: 150, baseSize: 150, petals: 9, mergedCount: 3, sourceIds: [10, 11, 12], colors: ["yellow", "blue"] }
  ];
  const treePlan = planGardenMerge(bouquets, 120);
  assert.equal(treePlan.bloom.tier, 2);
  assert.equal(treePlan.bloom.mergedCount, 9);
  assert.deepEqual([...treePlan.bloom.colors], ["blue", "orange", "pink", "purple", "red", "yellow"]);
  assert.equal(isRainbowTree(treePlan.bloom), true);
  const plainTree = { ...treePlan.bloom, colors: ["orange", "pink", "purple", "red", "yellow"] };
  assert.equal(isRainbowTree(plainTree), false);
  assert.equal(isRainbowTree(bouquets[0]), false);
});

test("garden snapshots carry merge ancestry colors and reject unknown ones", () => {
  const merged = planGardenMerge([
    createBloom(0, 100, 100, 500, 500),
    createBloom(1, 180, 100, 500, 500),
    createBloom(2, 140, 165, 500, 500)
  ], 120).bloom;
  const saved = serializeGardenState([merged], 30, 500, 500);
  assert.deepEqual([...saved.blooms[0].colors], ["orange", "pink", "purple"]);
  const restored = restoreGardenState(JSON.parse(JSON.stringify(saved)), 500, 500);
  assert.deepEqual([...restored.blooms[0].colors], ["orange", "pink", "purple"]);
  const corrupted = JSON.parse(JSON.stringify(saved));
  corrupted.blooms[0].colors = ["pink", "teal"];
  assert.throws(() => restoreGardenState(corrupted, 500, 500), TypeError);
});

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

test("ordinary play traces reach merges fast, trees early, and dissolutions regularly", () => {
  const viewports = [
    { width: 390, height: 844 },
    { width: 640, height: 360 }
  ];
  let tier1By50 = 0;
  let tier2By100 = 0;
  let dissolved = 0;
  const seeds = 24;
  for (let seed = 0; seed < seeds; seed += 1) {
    const viewport = viewports[seed % viewports.length];
    const rand = mulberry32(seed);
    const reach = neighborDistanceForLayout(viewport.width, viewport.height);
    const spread = Math.min(viewport.width, viewport.height) * 0.24;
    let blooms = [];
    let nextId = 0;
    let focusX = rand() * viewport.width;
    let focusY = rand() * viewport.height;
    const arrivals = { 1: null, 2: null };
    let vanishes = 0;

    const cascade = (taps) => {
      for (;;) {
        const plan = planGardenMerge(blooms, reach, { width: viewport.width, height: viewport.height });
        if (!plan) break;
        const mergedIds = new Set(plan.ids);
        blooms = blooms.filter((bloom) => !mergedIds.has(bloom.id));
        const placed = planBouquetGather(plan.bloom, blooms, { reach, width: viewport.width, height: viewport.height }) ?? plan.bloom;
        blooms.push(placed);
        if (arrivals[placed.tier] === null) arrivals[placed.tier] = taps;
      }
      for (;;) {
        const ids = planTreeDissolution(blooms, { distance: reach * 2 });
        if (!ids) break;
        const gone = new Set(ids);
        blooms = blooms.filter((bloom) => !gone.has(bloom.id));
        vanishes += 1;
      }
    };

    for (let taps = 1; taps <= 600; taps += 1) {
      if (rand() < 0.12) {
        focusX = rand() * viewport.width;
        focusY = rand() * viewport.height;
      }
      const x = Math.min(viewport.width, Math.max(0, focusX + (rand() - 0.5) * spread));
      const y = Math.min(viewport.height, Math.max(0, focusY + (rand() - 0.5) * spread));
      const hit = blooms.find((bloom) => Math.hypot(bloom.x - x, bloom.y - y) <= bloom.size * 0.5);
      if (hit || blooms.length >= MAX_BLOOMS) {
        const target = hit ?? nearestBloom(blooms, x, y);
        const grown = growBloom(target, viewport);
        const pulled = planBloomPull(grown, blooms, { width: viewport.width, height: viewport.height }) ?? grown;
        blooms = blooms.map((bloom) => (bloom.id === target.id ? pulled : bloom));
      } else {
        let fresh = createBloom(nextId, x, y, viewport.width, viewport.height);
        nextId += 1;
        const kin = blooms.filter((bloom) => Math.hypot(bloom.x - x, bloom.y - y) <= reach);
        if (kin.length >= 2) {
          fresh = {
            ...fresh,
            x: Math.min(Math.max((kin[0].x + kin[1].x) / 2, fresh.size * 0.43), viewport.width - fresh.size * 0.43),
            y: Math.min(Math.max((kin[0].y + kin[1].y) / 2, fresh.size * 0.43), viewport.height - fresh.size * 0.43)
          };
        }
        blooms.push(fresh);
      }
      cascade(taps);
    }
    if (arrivals[1] !== null && arrivals[1] <= 50) tier1By50 += 1;
    if (arrivals[2] !== null && arrivals[2] <= 100) tier2By100 += 1;
    if (vanishes > 0) dissolved += 1;
  }
  assert.ok(tier1By50 / seeds >= 0.9, `tier-1 by tap 50 in only ${tier1By50}/${seeds} traces`);
  assert.ok(tier2By100 / seeds >= 0.8, `tier-2 by tap 100 in only ${tier2By100}/${seeds} traces`);
  assert.ok(dissolved / seeds >= 0.9, `dissolutions seen in only ${dissolved}/${seeds} traces`);
});
