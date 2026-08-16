export const FLOOR_Y = 0.79;
export const BUILD_TOP = 0.12;

export const STACK_PIECES = Object.freeze([
  Object.freeze({ id: "berry", kind: "block", width: 0.17, height: 0.17, tone: 392.0, supports: true, restsOn: true, spans: false, covers: false, nestsWith: Object.freeze([]) }),
  Object.freeze({ id: "sky", kind: "beam", width: 0.25, height: 0.13, tone: 440.0, supports: true, restsOn: true, spans: true, covers: false, nestsWith: Object.freeze([]) }),
  Object.freeze({ id: "sunny", kind: "ball", width: 0.15, height: 0.15, tone: 523.25, supports: false, restsOn: true, spans: false, covers: false, nestsWith: Object.freeze(["nest"]) }),
  Object.freeze({ id: "nest", kind: "nest", width: 0.25, height: 0.19, tone: 349.23, supports: true, restsOn: true, spans: false, covers: false, nestsWith: Object.freeze(["ball"]) }),
  Object.freeze({ id: "leaf", kind: "roof", width: 0.21, height: 0.16, tone: 466.16, supports: false, restsOn: true, spans: true, covers: true, nestsWith: Object.freeze([]) })
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

export function createStackState() {
  return createState(STACK_PIECES.map((piece, index) => ({
    ...piece,
    x: 0.1 + (index * 0.2),
    y: 0.92,
    placed: false,
    moves: 0
  })));
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

export function settlePiece(state, id, point, layout) {
  const pieces = normalizeState(state);
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

  const nestingPartner = others
    .filter((other) => moving.nestsWith.includes(other.kind) || other.nestsWith.includes(moving.kind))
    .sort((left, right) => layoutDistance({ x, y: point.y }, left, layout)
      - layoutDistance({ x, y: point.y }, right, layout))[0];

  const spanSupports = moving.spans ? others.filter((other) => other.supports && point.y < other.y)
    .filter((other) => Math.abs(other.x - x) <= movingSize.width * 0.75)
    .sort((left, right) => left.x - right.x) : [];
  const leftSupport = [...spanSupports].reverse().find((other) => other.x < x);
  const rightSupport = spanSupports.find((other) => other.x > x);
  const levelTolerance = (0.11 * metrics.unit) / metrics.height;

  if (leftSupport && rightSupport && Math.abs(leftSupport.y - rightSupport.y) <= levelTolerance) {
    x = (leftSupport.x + rightSupport.x) / 2;
    const supportTop = Math.min(leftSupport.y - dimensions(leftSupport, layout).height / 2, rightSupport.y - dimensions(rightSupport, layout).height / 2);
    y = Math.max(BUILD_TOP + movingSize.height / 2, supportTop - movingSize.height / 2);
    settledAs = moving.covers ? "enclosure" : "bridge";
  } else if (nestingPartner && layoutDistance({ x, y: point.y }, nestingPartner, layout) < 0.24) {
    x = nestingPartner.x;
    y = nestingPartner.y + (moving.kind === "ball" ? 0.015 : -0.015);
    settledAs = "nested";
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

  const nextPieces = pieces.map((piece) => piece.id === id
    ? { ...piece, x, y, placed: true, moves: piece.moves + 1 }
    : piece);
  const nextState = createState(nextPieces);
  return Object.freeze({
    state: nextState,
    piece: pieceById(nextState.pieces, id),
    settledAs,
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
