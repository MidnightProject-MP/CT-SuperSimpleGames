function assertCoordinate(value, name) {
  if (!Number.isFinite(value)) throw new TypeError(`${name} must be a finite number`);
}

function assertRect(rect) {
  if (!rect) throw new TypeError("each target must have a rectangle");
  for (const edge of ["left", "right", "top", "bottom"]) assertCoordinate(rect[edge], edge);
  if (rect.right < rect.left || rect.bottom < rect.top) {
    throw new RangeError("target rectangles must not be inverted");
  }
}

function squaredDistanceToRect(x, y, rect) {
  const dx = x < rect.left ? rect.left - x : x > rect.right ? x - rect.right : 0;
  const dy = y < rect.top ? rect.top - y : y > rect.bottom ? y - rect.bottom : 0;
  return (dx * dx) + (dy * dy);
}

function squaredDistanceToCenter(x, y, rect) {
  const dx = x - ((rect.left + rect.right) / 2);
  const dy = y - ((rect.top + rect.bottom) / 2);
  return (dx * dx) + (dy * dy);
}

export function nearestTargetIndex({ x, y, rects }) {
  assertCoordinate(x, "x");
  assertCoordinate(y, "y");
  if (!Array.isArray(rects) || rects.length === 0) {
    throw new RangeError("rects must contain at least one target");
  }

  let bestIndex = 0;
  let bestEdgeDistance = Infinity;
  let bestCenterDistance = Infinity;

  rects.forEach((rect, index) => {
    assertRect(rect);
    const edgeDistance = squaredDistanceToRect(x, y, rect);
    const centerDistance = squaredDistanceToCenter(x, y, rect);
    if (edgeDistance < bestEdgeDistance
      || (edgeDistance === bestEdgeDistance && centerDistance < bestCenterDistance)) {
      bestIndex = index;
      bestEdgeDistance = edgeDistance;
      bestCenterDistance = centerDistance;
    }
  });

  return bestIndex;
}

