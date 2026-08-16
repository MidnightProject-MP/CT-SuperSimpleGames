export const MAX_BLOOMS = 24;

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
