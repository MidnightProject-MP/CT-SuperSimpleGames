export const FLOOR_Y = 0.79;
export const BUILD_TOP = 0.12;
export const STACK_RESIDENT_TOUCHES = 4;

export const STACK_PIECES = Object.freeze([
  Object.freeze({ id: "berry", kind: "block", width: 0.14, height: 0.18, tone: 392.0, supports: true, restsOn: true, spans: false, covers: false, nestsWith: Object.freeze([]) }),
  Object.freeze({ id: "sky", kind: "beam", width: 0.38, height: 0.12, tone: 440.0, supports: true, restsOn: true, spans: true, covers: false, nestsWith: Object.freeze([]) }),
  Object.freeze({ id: "sunny", kind: "ball", width: 0.15, height: 0.15, tone: 523.25, supports: false, restsOn: true, spans: false, covers: false, nestsWith: Object.freeze(["nest"]) }),
  Object.freeze({ id: "nest", kind: "nest", width: 0.21, height: 0.19, tone: 349.23, supports: true, restsOn: true, spans: false, covers: false, nestsWith: Object.freeze(["ball"]) }),
  Object.freeze({ id: "leaf", kind: "roof", width: 0.21, height: 0.16, tone: 466.16, supports: false, restsOn: true, spans: true, covers: true, nestsWith: Object.freeze([]) })
]);

export const STACK_IDEAS = Object.freeze([
  Object.freeze({ id: "bridge", label: "A bridge", hint: "Can your pieces make a way across?" }),
  Object.freeze({ id: "tower", label: "A tall tower", hint: "Can three pieces reach upward?" }),
  Object.freeze({ id: "home", label: "A little home", hint: "Can something rest under a roof?" }),
  Object.freeze({ id: "nest", label: "A cozy nest", hint: "Can one piece fit inside another?" }),
  Object.freeze({ id: "beside", label: "Side by side", hint: "Can three pieces make a row?" })
]);

const PIECE_BY_ID = new Map(STACK_PIECES.map((piece) => [piece.id, piece]));
const TAP_X = Object.freeze([0.2, 0.38, 0.56, 0.74, 0.5]);

function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum);
}

function freezePiece(piece) {
  return Object.freeze({ ...piece });
}

function createState(pieces) {
  return Object.freeze({ pieces: Object.freeze(pieces.map(freezePiece)) });
}

function normalizeState(state) {
  if (!state || typeof state !== "object" || !Array.isArray(state.pieces)) {
    throw new TypeError("stack state must contain pieces");
  }
  if (state.pieces.length !== STACK_PIECES.length) throw new RangeError("stack state has the wrong piece count");
  const ids = new Set();
  const pieces = state.pieces.map((piece) => {
    const definition = PIECE_BY_ID.get(piece?.id);
    if (!definition || ids.has(piece.id)) throw new RangeError("stack state contains invalid piece IDs");
    ids.add(piece.id);
    for (const coordinate of ["x", "y"]) {
      if (!Number.isFinite(piece[coordinate]) || piece[coordinate] < 0 || piece[coordinate] > 1) {
        throw new RangeError(`piece ${coordinate} must be between zero and one`);
      }
    }
    if (typeof piece.placed !== "boolean") throw new TypeError("piece placed must be boolean");
    if (!Number.isInteger(piece.moves) || piece.moves < 0) throw new RangeError("piece moves must be non-negative");
    return { ...piece, ...definition };
  });
  return pieces;
}

function pieceById(pieces, id) {
  const piece = pieces.find((candidate) => candidate.id === id);
  if (!piece) throw new RangeError(`unknown stack piece: ${id}`);
  return piece;
}

function layoutMetrics(layout = { width: 1, height: 1 }) {
  if (!layout || !Number.isFinite(layout.width) || !Number.isFinite(layout.height)
    || layout.width <= 0 || layout.height <= 0) {
    throw new RangeError("layout must have positive finite dimensions");
  }
  return { ...layout, unit: Math.min(layout.width, layout.height) };
}

function dimensions(piece, layout) {
  const metrics = layoutMetrics(layout);
  return {
    width: (piece.width * metrics.unit) / metrics.width,
    height: (piece.height * metrics.unit) / metrics.height
  };
}

function layoutDistance(first, second, layout) {
  const metrics = layoutMetrics(layout);
  return Math.hypot(
    ((first.x - second.x) * metrics.width) / metrics.unit,
    ((first.y - second.y) * metrics.height) / metrics.unit
  );
}

function canNest(first, second) {
  return first.nestsWith.includes(second.kind) || second.nestsWith.includes(first.kind);
}

function piecesOverlap(first, second, layout) {
  const metrics = layoutMetrics(layout);
  const firstSize = dimensions(first, layout);
  const secondSize = dimensions(second, layout);
  const toleranceX = Math.min(0.004, 1 / metrics.width);
  const toleranceY = Math.min(0.004, 1 / metrics.height);
  return Math.abs(first.x - second.x) < ((firstSize.width + secondSize.width) / 2) - toleranceX
    && Math.abs(first.y - second.y) < ((firstSize.height + secondSize.height) / 2) - toleranceY;
}

function collisionIds(pieces, candidate, layout, ignoredIds = new Set()) {
  return pieces
    .filter((piece) => piece.placed && piece.id !== candidate.id && !ignoredIds.has(piece.id)
      && piecesOverlap(candidate, piece, layout))
    .map(({ id }) => id);
}

export function unintendedOverlapsFor(state, layout) {
  const pieces = normalizeState(state).filter((piece) => piece.placed);
  const overlaps = [];
  for (let firstIndex = 0; firstIndex < pieces.length; firstIndex += 1) {
    for (let secondIndex = firstIndex + 1; secondIndex < pieces.length; secondIndex += 1) {
      const first = pieces[firstIndex];
      const second = pieces[secondIndex];
      const intendedNest = canNest(first, second) && layoutDistance(first, second, layout) < 0.075;
      if (!intendedNest && piecesOverlap(first, second, layout)) {
        overlaps.push(Object.freeze({ first: first.id, second: second.id }));
      }
    }
  }
  return Object.freeze(overlaps);
}

function clearHorizontalCandidate(pieces, moving, desiredX, y, layout, ignoredIds = new Set()) {
  const metrics = layoutMetrics(layout);
  const movingSize = dimensions(moving, layout);
  const minimum = movingSize.width / 2;
  const maximum = 1 - minimum;
  const gap = Math.min(0.022, 7 / metrics.width);
  const candidates = [clamp(desiredX, minimum, maximum)];
  for (const other of pieces.filter((piece) => piece.placed && piece.id !== moving.id && !ignoredIds.has(piece.id))) {
    const otherSize = dimensions(other, layout);
    const separation = (movingSize.width + otherSize.width) / 2 + gap;
    candidates.push(clamp(other.x - separation, minimum, maximum));
    candidates.push(clamp(other.x + separation, minimum, maximum));
  }
  const unique = [...new Set(candidates.map((value) => value.toFixed(8)))].map(Number)
    .sort((left, right) => Math.abs(left - desiredX) - Math.abs(right - desiredX) || left - right);
  return unique.find((x) => collisionIds(pieces, { ...moving, x, y, placed: true }, layout, ignoredIds).length === 0) ?? null;
}

function resolvePlacement(pieces, moving, candidate, layout, ignoredIds = new Set()) {
  const initial = { ...moving, ...candidate, placed: true };
  if (collisionIds(pieces, initial, layout, ignoredIds).length === 0) {
    return Object.freeze({ ...candidate, collisionResolved: false });
  }

  const movingSize = dimensions(moving, layout);
  const metrics = layoutMetrics(layout);
  const supportReach = (0.12 * metrics.unit) / metrics.width;
  const supports = pieces.filter((piece) => piece.placed && piece.id !== moving.id && piece.supports
    && Math.abs(piece.x - candidate.x) <= ((dimensions(piece, layout).width + movingSize.width) / 2) + supportReach)
    .sort((left, right) => Math.abs(left.x - candidate.x) - Math.abs(right.x - candidate.x) || left.y - right.y);
  for (const support of supports) {
    const supportSize = dimensions(support, layout);
    const x = clamp(support.x, movingSize.width / 2, 1 - movingSize.width / 2);
    const y = support.y - ((supportSize.height + movingSize.height) / 2);
    if (y < BUILD_TOP + movingSize.height / 2) continue;
    const stacked = { ...moving, x, y, placed: true };
    if (collisionIds(pieces, stacked, layout).length === 0) {
      return Object.freeze({ x, y, settledAs: "stacked", collisionResolved: true });
    }
  }

  const structural = ["nested", "bridge", "enclosure"].includes(candidate.settledAs);
  const levels = structural ? [FLOOR_Y - movingSize.height / 2] : [candidate.y, FLOOR_Y - movingSize.height / 2];
  for (const y of levels) {
    const x = clearHorizontalCandidate(pieces, moving, candidate.x, y, layout);
    if (x !== null) return Object.freeze({ x, y, settledAs: !structural && y === candidate.y ? candidate.settledAs : "floor", collisionResolved: true });
  }

  if (moving.placed) {
    return Object.freeze({ x: moving.x, y: moving.y, settledAs: "returned", collisionResolved: true });
  }
  return Object.freeze({ x: moving.x, y: moving.y, settledAs: "waiting", collisionResolved: true });
}

export function resolveStackLayout(state, layout, previousLayout = layout) {
  const source = normalizeState(state);
  layoutMetrics(previousLayout);
  const priorBridges = structuresFor(state, previousLayout).filter((structure) => structure.type === "bridge");
  const reservedIds = new Set(priorBridges.flatMap((bridge) => [bridge.top, ...bridge.supports]));
  const resolved = [];

  for (const bridge of priorBridges) {
    const top = pieceById(source, bridge.top);
    const supports = bridge.supports.map((id) => pieceById(source, id)).sort((left, right) => left.x - right.x);
    const [left, right] = supports;
    const topSize = dimensions(top, layout);
    const leftSize = dimensions(left, layout);
    const rightSize = dimensions(right, layout);
    const metrics = layoutMetrics(layout);
    const center = clamp(top.x, topSize.width / 2, 1 - topSize.width / 2);
    const minimumSeparation = ((leftSize.width + rightSize.width) / 2) + ((0.015 * metrics.unit) / metrics.width);
    const maximumSeparation = topSize.width * 0.9;
    const separation = clamp(Math.abs(right.x - left.x), minimumSeparation, maximumSeparation);
    const leftX = clamp(center - (separation / 2), leftSize.width / 2, 1 - leftSize.width / 2);
    const rightX = clamp(center + (separation / 2), rightSize.width / 2, 1 - rightSize.width / 2);
    const leftY = FLOOR_Y - (leftSize.height / 2);
    const rightY = FLOOR_Y - (rightSize.height / 2);
    const supportTop = Math.min(leftY - (leftSize.height / 2), rightY - (rightSize.height / 2));
    resolved.push(
      { ...left, x: leftX, y: leftY },
      { ...right, x: rightX, y: rightY },
      { ...top, x: center, y: supportTop - (topSize.height / 2) }
    );
  }

  const placed = source.filter((piece) => piece.placed)
    .filter((piece) => !reservedIds.has(piece.id))
    .sort((left, right) => right.y - left.y || STACK_PIECES.findIndex(({ id }) => id === left.id) - STACK_PIECES.findIndex(({ id }) => id === right.id));
  for (const piece of placed) {
    const nestingPartner = resolved.find((other) => canNest(piece, other) && layoutDistance(piece, other, layout) < 0.075);
    const ignoredIds = nestingPartner ? new Set([nestingPartner.id]) : new Set();
    const placement = resolvePlacement(resolved, piece, { x: piece.x, y: piece.y, settledAs: nestingPartner ? "nested" : "layout" }, layout, ignoredIds);
    resolved.push({
      ...piece,
      x: placement.x,
      y: placement.y,
      placed: placement.settledAs !== "waiting",
    });
  }
  const byId = new Map(resolved.map((piece) => [piece.id, piece]));
  return createState(source.map((piece) => byId.get(piece.id) || piece));
}

export function createStackState() {
  return createState(STACK_PIECES.map((piece, index) => ({
    ...piece,
    x: 0.1 + (index * 0.2),
    y: 0.92,
    placed: false,
    moves: 0
  })));
}

export function serializeStackState(state, layout) {
  const pieces = normalizeState(state);
  const snapshot = {
    pieces: Object.freeze(pieces.map(({ id, x, y, placed, moves }) => Object.freeze({ id, x, y, placed, moves })))
  };
  if (layout !== undefined) {
    const metrics = layoutMetrics(layout);
    snapshot.layout = Object.freeze({ width: metrics.width, height: metrics.height });
  }
  return Object.freeze(snapshot);
}

export function restoreStackState(snapshot) {
  const pieces = normalizeState(snapshot);
  return createState(pieces);
}

export function relationshipsFor(state, id, layout) {
  const pieces = normalizeState(state);
  const piece = pieceById(pieces, id);
  if (!piece.placed) return Object.freeze([]);
  const relations = [];
  const pieceSize = dimensions(piece, layout);

  for (const other of pieces) {
    if (!other.placed || other.id === piece.id) continue;
    const otherSize = dimensions(other, layout);
    const nestPair = new Set([piece.kind, other.kind]);
    if (nestPair.has("ball") && nestPair.has("nest") && layoutDistance(piece, other, layout) < 0.075) {
      relations.push(Object.freeze({ type: "nested", with: other.id }));
      continue;
    }

    const horizontalOverlap = Math.abs(piece.x - other.x) < Math.min(0.075, (pieceSize.width + otherSize.width) * 0.24);
    const expectedGap = (pieceSize.height + otherSize.height) / 2;
    const verticalTolerance = (0.045 * layoutMetrics(layout).unit) / layoutMetrics(layout).height;
    if (horizontalOverlap && Math.abs(Math.abs(piece.y - other.y) - expectedGap) < verticalTolerance) {
      relations.push(Object.freeze({ type: "stacked", with: other.id }));
      continue;
    }

    const bothOnFloor = Math.abs((piece.y + pieceSize.height / 2) - FLOOR_Y) < 0.035
      && Math.abs((other.y + otherSize.height / 2) - FLOOR_Y) < 0.035;
    const friendlyGap = Math.abs(piece.x - other.x) - ((pieceSize.width + otherSize.width) / 2);
    const friendlyReach = (0.11 * layoutMetrics(layout).unit) / layoutMetrics(layout).width;
    if (bothOnFloor && friendlyGap >= -0.03 && friendlyGap <= friendlyReach) {
      relations.push(Object.freeze({ type: "beside", with: other.id }));
    }
  }

  return Object.freeze(relations);
}

export function structuresFor(state, layout) {
  const pieces = normalizeState(state).filter((piece) => piece.placed);
  const structures = [];
  for (const top of pieces.filter((piece) => piece.spans)) {
    const topSize = dimensions(top, layout);
    const supports = pieces.filter((piece) => {
      if (piece.id === top.id || !piece.supports || piece.y <= top.y) return false;
      const size = dimensions(piece, layout);
      return Math.abs(piece.x - top.x) <= topSize.width * 0.68
        && piece.y - top.y <= (topSize.height + size.height) * 1.5;
    }).sort((left, right) => left.x - right.x);
    if (supports.length >= 2 && supports[0].x < top.x && supports.at(-1).x > top.x) {
      structures.push(Object.freeze({ type: top.covers ? "enclosure" : "bridge", top: top.id, supports: Object.freeze([supports[0].id, supports.at(-1).id]) }));
    }
    if (top.covers) {
      const sheltered = pieces.find((piece) => piece.id !== top.id && piece.y > top.y
        && Math.abs(piece.x - top.x) < topSize.width * 0.52);
      if (sheltered) structures.push(Object.freeze({ type: "shelter", top: top.id, inside: sheltered.id }));
    }
  }
  return Object.freeze(structures);
}

export function stackResidentFor(state, layout) {
  const pieces = normalizeState(state);
  const bridge = structuresFor(state, layout).find((structure) => structure.type === "bridge");
  if (!bridge) return null;
  const top = pieceById(pieces, bridge.top);
  const topSize = dimensions(top, layout);
  return Object.freeze({
    type: "bird",
    label: "the spotted bird",
    x: top.x,
    y: clamp(top.y - (topSize.height * 0.72), BUILD_TOP + 0.04, FLOOR_Y - 0.08),
    anchorIds: Object.freeze([bridge.top, ...bridge.supports])
  });
}

export function moveStackResident(resident, visit, layout) {
  if (!resident || resident.type !== "bird" || !Number.isFinite(resident.x) || !Number.isFinite(resident.y)
    || !Array.isArray(resident.anchorIds) || resident.anchorIds.length !== 3) {
    throw new TypeError("invalid stack resident");
  }
  if (!Number.isInteger(visit) || visit < 0) throw new RangeError("resident visit must be non-negative");
  const metrics = layoutMetrics(layout);
  const offsets = Object.freeze([[0, 0], [34, -12], [-30, -8], [14, 18]]);
  const [offsetX, offsetY] = offsets[visit % offsets.length];
  return Object.freeze({
    x: clamp(resident.x + (offsetX / metrics.width), 0.06, 0.94),
    y: clamp(resident.y + (offsetY / metrics.height), BUILD_TOP + 0.02, FLOOR_Y - 0.04)
  });
}

function connectedCount(state, relationType, layout) {
  const pieces = normalizeState(state).filter((piece) => piece.placed);
  const links = new Map(pieces.map((piece) => [piece.id, new Set()]));
  for (const piece of pieces) {
    for (const relation of relationshipsFor(state, piece.id, layout)) {
      if (relation.type !== relationType) continue;
      links.get(piece.id).add(relation.with);
      links.get(relation.with)?.add(piece.id);
    }
  }
  let largest = 0;
  const visited = new Set();
  for (const piece of pieces) {
    if (visited.has(piece.id)) continue;
    const pending = [piece.id];
    let count = 0;
    while (pending.length) {
      const id = pending.pop();
      if (visited.has(id)) continue;
      visited.add(id);
      count += 1;
      for (const neighbor of links.get(id) || []) pending.push(neighbor);
    }
    largest = Math.max(largest, count);
  }
  return largest;
}

export function matchesStackIdea(state, ideaId, layout) {
  if (!STACK_IDEAS.some((idea) => idea.id === ideaId)) throw new RangeError(`unknown stack idea: ${ideaId}`);
  if (ideaId === "bridge") return structuresFor(state, layout).some((structure) => structure.type === "bridge");
  if (ideaId === "home") return structuresFor(state, layout).some((structure) => ["shelter", "enclosure"].includes(structure.type));
  if (ideaId === "nest") {
    return normalizeState(state).some((piece) => piece.placed
      && relationshipsFor(state, piece.id, layout).some((relation) => relation.type === "nested"));
  }
  return connectedCount(state, ideaId === "tower" ? "stacked" : "beside", layout) >= 3;
}

export function settlePiece(state, id, point, layout) {
  const pieces = normalizeState(resolveStackLayout(state, layout));
  const moving = pieceById(pieces, id);
  const metrics = layoutMetrics(layout);
  const movingSize = dimensions(moving, layout);
  if (!point || !Number.isFinite(point.x) || !Number.isFinite(point.y)) {
    throw new TypeError("settle point must have finite coordinates");
  }

  const others = pieces.filter((piece) => piece.id !== id && piece.placed);
  let x = clamp(point.x, movingSize.width / 2, 1 - movingSize.width / 2);
  let y;
  let settledAs = "floor";
  let ignoredCollisionIds = new Set();

  const nestingPartner = others
    .filter((other) => moving.nestsWith.includes(other.kind) || other.nestsWith.includes(moving.kind))
    .sort((left, right) => layoutDistance({ x, y: point.y }, left, layout)
      - layoutDistance({ x, y: point.y }, right, layout))[0];

  const levelTolerance = (0.11 * metrics.unit) / metrics.height;
  const spanSupports = moving.spans ? others.filter((other) => other.supports && point.y < other.y)
    .sort((left, right) => left.x - right.x) : [];
  const supportPairs = [];
  for (let leftIndex = 0; leftIndex < spanSupports.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < spanSupports.length; rightIndex += 1) {
      const left = spanSupports[leftIndex];
      const right = spanSupports[rightIndex];
      const separation = right.x - left.x;
      const midpoint = (left.x + right.x) / 2;
      if (Math.abs(left.y - right.y) > levelTolerance
        || separation < movingSize.width * 0.32 || separation > movingSize.width * 1.08
        || Math.abs(midpoint - x) > movingSize.width * 0.82) continue;
      supportPairs.push({ left, right, midpoint, score: Math.abs(midpoint - x) + Math.abs(left.y - right.y) });
    }
  }
  supportPairs.sort((first, second) => first.score - second.score || first.left.x - second.left.x);
  const bridgePair = supportPairs[0];

  if (bridgePair) {
    x = bridgePair.midpoint;
    const supportTop = Math.min(bridgePair.left.y - dimensions(bridgePair.left, layout).height / 2, bridgePair.right.y - dimensions(bridgePair.right, layout).height / 2);
    y = Math.max(BUILD_TOP + movingSize.height / 2, supportTop - movingSize.height / 2);
    settledAs = moving.covers ? "enclosure" : "bridge";
    ignoredCollisionIds = new Set([bridgePair.left.id, bridgePair.right.id]);
  } else if (nestingPartner && layoutDistance({ x, y: point.y }, nestingPartner, layout) < 0.24) {
    x = nestingPartner.x;
    y = nestingPartner.y + (moving.kind === "ball" ? 0.015 : -0.015);
    settledAs = "nested";
    ignoredCollisionIds = new Set([nestingPartner.id]);
  } else {
    const supports = others
      .filter((other) => point.y < other.y
        && other.y - point.y > (0.07 * metrics.unit) / metrics.height
        && Math.abs(x - other.x) <= ((movingSize.width + dimensions(other, layout).width) * 0.55)
        && other.y - point.y < (0.42 * metrics.unit) / metrics.height)
      .sort((left, right) => left.y - right.y);
    const support = supports[0];
    if (support) {
      x = support.x;
      y = support.y - ((dimensions(support, layout).height + movingSize.height) / 2);
      y = Math.max(BUILD_TOP + (movingSize.height / 2), y);
      settledAs = "stacked";
    } else {
      y = FLOOR_Y - (movingSize.height / 2);
    }
  }

  const resolved = resolvePlacement(pieces, moving, { x, y, settledAs }, layout, ignoredCollisionIds);
  x = resolved.x;
  y = resolved.y;
  settledAs = resolved.settledAs;

  const nextPieces = pieces.map((piece) => piece.id === id
    ? { ...piece, x, y, placed: settledAs !== "waiting", moves: piece.moves + 1 }
    : piece);
  const nextState = createState(nextPieces);
  return Object.freeze({
    state: nextState,
    piece: pieceById(nextState.pieces, id),
    settledAs,
    collisionResolved: resolved.collisionResolved,
    relations: relationshipsFor(nextState, id, layout),
    structures: structuresFor(nextState, layout)
  });
}

export function tapPiece(state, id, layout) {
  const pieces = normalizeState(state);
  const moving = pieceById(pieces, id);
  const others = pieces.filter((piece) => piece.id !== id && piece.placed);
  if (others.length === 0) {
    const index = STACK_PIECES.findIndex((piece) => piece.id === id);
    return settlePiece(state, id, { x: TAP_X[index], y: 0.65 }, layout);
  }

  const support = others[(moving.moves + STACK_PIECES.findIndex((piece) => piece.id === id)) % others.length];
  return settlePiece(state, id, { x: support.x, y: support.y - 0.2 }, layout);
}
