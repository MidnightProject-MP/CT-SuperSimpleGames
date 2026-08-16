export const MAX_BLOOMS = 24;
export const MAX_BLOOM_SIZE = 164;
export const BLOOM_GROWTH_STEP = 12;
export const NEIGHBOR_DISTANCE = 170;
export const MAX_SPARKS = 24;
export const MAX_GARDEN_LINKS = 32;
export const MAX_GARDEN_CANOPIES = 4;
export const GARDEN_VISITOR_TOUCHES = 4;
export const MAX_BLOOM_TIER = 2;

export const BLOOM_TIERS = Object.freeze([
  Object.freeze({ name: "flower", label: "flower" }),
  Object.freeze({ name: "bouquet", label: "three-flower bouquet" }),
  Object.freeze({ name: "tree", label: "flowering tree" })
]);

export const BLOOM_STAGES = Object.freeze([
  Object.freeze({ name: "fresh", label: "fresh bloom", toneFactor: 1 }),
  Object.freeze({ name: "tall", label: "taller bloom", toneFactor: 1.04 }),
  Object.freeze({ name: "full", label: "full bloom", toneFactor: 1.08 }),
  Object.freeze({ name: "seed", label: "seeds ready", toneFactor: 0.94 }),
  Object.freeze({ name: "renewed", label: "new bloom", toneFactor: 1.12 })
]);

export const COLORS = Object.freeze([
  { name: "pink", petal: "#ef3f8f", light: "#ff8fbe", tone: 523.25 },
  { name: "purple", petal: "#7b55e7", light: "#bca7ff", tone: 587.33 },
  { name: "orange", petal: "#ff7a35", light: "#ffb067", tone: 659.25 },
  { name: "blue", petal: "#168fe5", light: "#70caf9", tone: 698.46 },
  { name: "red", petal: "#ef4545", light: "#ff8c7f", tone: 783.99 },
  { name: "yellow", petal: "#f4c928", light: "#fff07a", tone: 880 }
]);

export function clampPosition(x, y, width, height, radius) {
  const safeRadius = Math.max(0, radius);
  return {
    x: Math.min(Math.max(x, safeRadius), Math.max(safeRadius, width - safeRadius)),
    y: Math.min(Math.max(y, safeRadius), Math.max(safeRadius, height - safeRadius))
  };
}

export function createBloom(index, x, y, width, height) {
  const color = COLORS[index % COLORS.length];
  const sizeStep = index % 3;
  const size = 92 + sizeStep * 24;
  const position = clampPosition(x, y, width, height, size * 0.43);

  return {
    id: index,
    ...position,
    size,
    baseSize: size,
    petals: 5 + (index % 4),
    color,
    tier: 0,
    mergedCount: 1,
    sourceIds: Object.freeze([index]),
    stage: 0,
    visits: 0
  };
}

export function planGardenMerge(items, maxDistance, { width, height } = {}) {
  if (!Number.isFinite(maxDistance) || maxDistance <= 0) throw new RangeError("merge distance must be positive");
  const blooms = [...items].sort((left, right) => left.id - right.id);
  for (const bloom of blooms) {
    const tier = bloom?.tier ?? 0;
    if (!bloom || !Number.isInteger(bloom.id) || !Number.isFinite(bloom.x) || !Number.isFinite(bloom.y)
      || !Number.isInteger(tier) || tier < 0 || tier > MAX_BLOOM_TIER || !bloom.color) {
      throw new TypeError("merge planning requires valid garden blooms");
    }
  }
  const distance = (first, second) => Math.hypot(first.x - second.x, first.y - second.y);
  for (let firstIndex = 0; firstIndex < blooms.length; firstIndex += 1) {
    const first = blooms[firstIndex];
    const tier = first.tier ?? 0;
    if (tier >= MAX_BLOOM_TIER) continue;
    for (let secondIndex = firstIndex + 1; secondIndex < blooms.length; secondIndex += 1) {
      const second = blooms[secondIndex];
      if ((second.tier ?? 0) !== tier || second.color.name !== first.color.name || distance(first, second) > maxDistance) continue;
      for (let thirdIndex = secondIndex + 1; thirdIndex < blooms.length; thirdIndex += 1) {
        const third = blooms[thirdIndex];
        if ((third.tier ?? 0) !== tier || third.color.name !== first.color.name
          || distance(first, third) > maxDistance || distance(second, third) > maxDistance) continue;
        const group = [first, second, third];
        const nextTier = tier + 1;
        const size = nextTier === 1 ? 150 : MAX_BLOOM_SIZE;
        const center = {
          x: group.reduce((sum, bloom) => sum + bloom.x, 0) / 3,
          y: group.reduce((sum, bloom) => sum + bloom.y, 0) / 3,
        };
        const position = Number.isFinite(width) && Number.isFinite(height)
          ? clampPosition(center.x, center.y, width, height, size * 0.43)
          : center;
        const sourceIds = group.flatMap((bloom) => bloom.sourceIds || [bloom.id]).sort((left, right) => left - right);
        const bloom = Object.freeze({
          ...third,
          ...position,
          size,
          baseSize: size,
          petals: nextTier === 1 ? 9 : 12,
          color: third.color,
          tier: nextTier,
          mergedCount: group.reduce((sum, item) => sum + (item.mergedCount || 1), 0),
          sourceIds: Object.freeze(sourceIds),
          stage: 0,
          visits: 0,
        });
        return Object.freeze({ ids: Object.freeze(group.map(({ id }) => id)), bloom });
      }
    }
  }
  return null;
}

export function neighborDistanceForLayout(width, height) {
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    throw new RangeError("layout must have positive finite dimensions");
  }
  return Math.min(190, Math.max(120, Math.min(width, height) * 0.34));
}

export function gardenNeighborhoods(items, maxDistance, {
  maxLinks = MAX_GARDEN_LINKS,
  maxCanopies = MAX_GARDEN_CANOPIES
} = {}) {
  const blooms = [...items].sort((left, right) => left.id - right.id);
  if (!Number.isFinite(maxDistance) || maxDistance <= 0) throw new RangeError("maxDistance must be positive");
  if (!Number.isInteger(maxLinks) || maxLinks < 0 || !Number.isInteger(maxCanopies) || maxCanopies < 0) {
    throw new RangeError("neighborhood budgets must be non-negative integers");
  }
  const distance = (first, second) => Math.hypot(first.x - second.x, first.y - second.y);
  const links = [];
  for (let firstIndex = 0; firstIndex < blooms.length && links.length < maxLinks; firstIndex += 1) {
    for (let secondIndex = firstIndex + 1; secondIndex < blooms.length && links.length < maxLinks; secondIndex += 1) {
      const first = blooms[firstIndex];
      const second = blooms[secondIndex];
      if (distance(first, second) > maxDistance) continue;
      links.push(Object.freeze({
        first: first.id,
        second: second.id,
        type: first.color.name === second.color.name ? "harmony" : "alternating"
      }));
    }
  }
  const mature = blooms.filter((bloom) => bloom.stage === 2);
  const canopies = [];
  for (let a = 0; a < mature.length && canopies.length < maxCanopies; a += 1) {
    for (let b = a + 1; b < mature.length && canopies.length < maxCanopies; b += 1) {
      for (let c = b + 1; c < mature.length && canopies.length < maxCanopies; c += 1) {
        const group = [mature[a], mature[b], mature[c]];
        if (distance(group[0], group[1]) <= maxDistance && distance(group[0], group[2]) <= maxDistance
          && distance(group[1], group[2]) <= maxDistance) {
          canopies.push(Object.freeze({ ids: Object.freeze(group.map(({ id }) => id)), type: "canopy" }));
        }
      }
    }
  }
  return Object.freeze({ links: Object.freeze(links), canopies: Object.freeze(canopies) });
}

export function gardenVisitorFor(items, maxDistance) {
  const blooms = [...items].sort((left, right) => left.id - right.id);
  if (!Number.isFinite(maxDistance) || maxDistance <= 0) throw new RangeError("maxDistance must be positive");
  for (const bloom of blooms) {
    if (!bloom || !Number.isFinite(bloom.x) || !Number.isFinite(bloom.y)
      || !Number.isInteger(bloom.stage) || bloom.stage < 0 || bloom.stage >= BLOOM_STAGES.length) {
      throw new TypeError("visitors require valid garden blooms");
    }
  }
  const neighborhoods = gardenNeighborhoods(blooms, maxDistance);
  if (neighborhoods.canopies.length) {
    const anchorIds = neighborhoods.canopies[0].ids;
    const anchors = anchorIds.map((id) => blooms.find((bloom) => bloom.id === id));
    return Object.freeze({
      type: "bee",
      label: "one busy bee",
      x: anchors.reduce((sum, bloom) => sum + bloom.x, 0) / anchors.length,
      y: anchors.reduce((sum, bloom) => sum + bloom.y, 0) / anchors.length - 74,
      anchorIds,
    });
  }
  const seed = blooms.find((bloom) => bloom.stage === 3);
  if (seed) return Object.freeze({ type: "bird", label: "a spotted bird", x: seed.x + 66, y: seed.y - 58, anchorIds: Object.freeze([seed.id]) });
  for (let firstIndex = 0; firstIndex < blooms.length; firstIndex += 1) {
    for (let secondIndex = firstIndex + 1; secondIndex < blooms.length; secondIndex += 1) {
      const first = blooms[firstIndex];
      const second = blooms[secondIndex];
      const gap = Math.hypot(first.x - second.x, first.y - second.y);
      if (gap < maxDistance * 0.72 || gap > maxDistance * 1.35) continue;
      return Object.freeze({
        type: "butterfly",
        label: "a butterfly with two wings",
        x: (first.x + second.x) / 2,
        y: (first.y + second.y) / 2 - 62,
        anchorIds: Object.freeze([first.id, second.id]),
      });
    }
  }
  return null;
}

export function moveGardenVisitor(visitor, visit, width, height) {
  if (!visitor || !["bee", "bird", "butterfly"].includes(visitor.type)
    || !Number.isFinite(visitor.x) || !Number.isFinite(visitor.y)) throw new TypeError("invalid garden visitor");
  if (!Number.isInteger(visit) || visit < 0) throw new RangeError("visitor visit must be non-negative");
  const offsets = Object.freeze([[0, 0], [42, -18], [-38, -10], [18, 26]]);
  const offset = offsets[visit % offsets.length];
  return Object.freeze(clampPosition(visitor.x + offset[0], visitor.y + offset[1], width, height, 42));
}

export function trimToLimit(items, limit = MAX_BLOOMS) {
  return items.length <= limit ? items : items.slice(items.length - limit);
}

export function nearestBloom(items, x, y, { excludeId, maxDistance = Infinity } = {}) {
  if (!Number.isFinite(x) || !Number.isFinite(y)) throw new TypeError("coordinates must be finite");
  if (!Number.isFinite(maxDistance) && maxDistance !== Infinity) {
    throw new TypeError("maxDistance must be finite or Infinity");
  }
  if (maxDistance < 0) throw new RangeError("maxDistance must not be negative");

  let nearest = null;
  let nearestDistance = maxDistance;
  for (const bloom of items) {
    if (!bloom || !Number.isFinite(bloom.x) || !Number.isFinite(bloom.y)) {
      throw new TypeError("every bloom must have finite coordinates");
    }
    if (bloom.id === excludeId) continue;
    const distance = Math.hypot(bloom.x - x, bloom.y - y);
    if (distance >= nearestDistance) continue;
    nearest = bloom;
    nearestDistance = distance;
  }
  return nearest;
}

export function growBloom(bloom, {
  step = BLOOM_GROWTH_STEP,
  maxSize = MAX_BLOOM_SIZE,
  width,
  height
} = {}) {
  if (!bloom || !Number.isFinite(bloom.size)) throw new TypeError("bloom must have a finite size");
  if (!Number.isFinite(step) || step < 0) throw new RangeError("step must not be negative");
  if (!Number.isFinite(maxSize) || maxSize <= 0) throw new RangeError("maxSize must be positive");
  const stage = bloom.stage ?? 0;
  if (!Number.isInteger(stage) || stage < 0 || stage >= BLOOM_STAGES.length) {
    throw new RangeError("bloom stage is invalid");
  }
  const nextStage = (stage + 1) % BLOOM_STAGES.length;
  const baseSize = bloom.baseSize ?? bloom.size;
  const offsets = [0, step, step * 2, Math.round(step * 0.65), Math.round(step * 1.35)];
  const size = Math.min(maxSize, baseSize + offsets[nextStage]);
  const position = Number.isFinite(width) && Number.isFinite(height)
    ? clampPosition(bloom.x, bloom.y, width, height, size * 0.43)
    : { x: bloom.x, y: bloom.y };
  return {
    ...bloom,
    ...position,
    size,
    baseSize,
    stage: nextStage,
    visits: (bloom.visits || 0) + 1
  };
}

export function planGardenInteraction(items, x, y, {
  targetId,
  limit = MAX_BLOOMS
} = {}) {
  if (!Number.isInteger(limit) || limit < 1) throw new RangeError("limit must be a positive integer");
  const blooms = Array.from(items);
  if (targetId !== undefined) {
    const target = blooms.find((bloom) => bloom.id === targetId);
    if (target) return Object.freeze({ action: "revisit", id: target.id });
  }
  if (blooms.length < limit) return Object.freeze({ action: "create", x, y });
  const nearest = nearestBloom(blooms, x, y);
  return Object.freeze({ action: "revisit", id: nearest.id });
}
