export const MAX_BLOOMS = 24;
export const MAX_BLOOM_SIZE = 164;
export const BLOOM_GROWTH_STEP = 12;
export const NEIGHBOR_DISTANCE = 170;

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
    petals: 5 + (index % 4),
    color
  };
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
  if (!Number.isFinite(maxSize) || maxSize < bloom.size) {
    throw new RangeError("maxSize must not be smaller than the current bloom");
  }
  const size = Math.min(maxSize, bloom.size + step);
  const position = Number.isFinite(width) && Number.isFinite(height)
    ? clampPosition(bloom.x, bloom.y, width, height, size * 0.43)
    : { x: bloom.x, y: bloom.y };
  return { ...bloom, ...position, size, visits: (bloom.visits || 0) + 1 };
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
