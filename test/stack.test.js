import test from "node:test";
import assert from "node:assert/strict";
import {
  BUILD_TOP,
  FLOOR_Y,
  STACK_PIECES,
  STACK_IDEAS,
  STACK_RESIDENT_TOUCHES,
  createStackState,
  matchesStackIdea,
  moveStackResident,
  relationshipsFor,
  resolveStackLayout,
  restoreStackState,
  serializeStackState,
  settlePiece,
  stackResidentFor,
  structuresFor,
  tapPiece,
  unintendedOverlapsFor
} from "../src/stack.js";

test("a stack creation serializes minimally and restores through current definitions", () => {
  const moved = settlePiece(createStackState(), "sky", { x: 0.52, y: 0.6 }).state;
  const saved = serializeStackState(moved, { width: 390, height: 844 });
  assert.deepEqual(Object.keys(saved.pieces[0]), ["id", "x", "y", "placed", "moves"]);
  assert.deepEqual(saved.layout, { width: 390, height: 844 });
  assert.deepEqual(restoreStackState(JSON.parse(JSON.stringify(saved))), moved);
  assert.throws(() => restoreStackState({ pieces: saved.pieces.slice(1) }), RangeError);
  assert.throws(() => serializeStackState(moved, { width: 0, height: 844 }), RangeError);
});

test("stack state starts bounded, distinct, and reusable", () => {
  const state = createStackState();
  assert.equal(state.pieces.length, STACK_PIECES.length);
  assert.equal(new Set(state.pieces.map((piece) => piece.id)).size, STACK_PIECES.length);
  assert.equal(state.pieces.every((piece) => !piece.placed && piece.moves === 0), true);
  assert.equal(Object.isFrozen(state), true);
  assert.equal(Object.isFrozen(state.pieces), true);
});

test("piece definitions expose construction capabilities", () => {
  for (const piece of STACK_PIECES) {
    for (const name of ["supports", "restsOn", "spans", "covers"]) assert.equal(typeof piece[name], "boolean");
    assert.equal(Array.isArray(piece.nestsWith), true);
  }
  const beam = STACK_PIECES.find(({ kind }) => kind === "beam");
  const otherWidths = STACK_PIECES.filter(({ kind }) => kind !== "beam").map(({ width }) => width);
  assert.ok(beam.width >= Math.max(...otherWidths) * 1.5);
});

test("five optional pictorial ideas are stable and uniquely identified", () => {
  assert.deepEqual(STACK_IDEAS.map((idea) => idea.id), ["bridge", "tower", "home", "nest", "beside"]);
  assert.equal(STACK_IDEAS.every((idea) => idea.label && idea.hint && Object.isFrozen(idea)), true);
});

test("an ordinary drop always settles safely on the floor and remains in bounds", () => {
  const initial = createStackState();
  const left = settlePiece(initial, "berry", { x: -4, y: 0.3 });
  const right = settlePiece(initial, "sky", { x: 7, y: 0.9 });
  assert.equal(left.piece.x, STACK_PIECES[0].width / 2);
  assert.equal(left.piece.y + left.piece.height / 2, FLOOR_Y);
  assert.equal(right.piece.x, 1 - STACK_PIECES[1].width / 2);
  assert.equal(right.settledAs, "floor");
});

test("occupied drops stack or slide instead of visually merging", () => {
  let state = settlePiece(createStackState(), "berry", { x: 0.5, y: 0.7 }).state;
  const stacked = settlePiece(state, "sky", { x: 0.5, y: 0.75 });
  assert.equal(stacked.collisionResolved, true);
  assert.equal(stacked.settledAs, "stacked");
  assert.deepEqual(unintendedOverlapsFor(stacked.state), []);

  state = settlePiece(createStackState(), "sunny", { x: 0.5, y: 0.7 }).state;
  const shifted = settlePiece(state, "leaf", { x: 0.5, y: 0.75 });
  assert.equal(shifted.collisionResolved, true);
  assert.equal(shifted.settledAs, "floor");
  assert.notEqual(shifted.piece.x, 0.5);
  assert.deepEqual(unintendedOverlapsFor(shifted.state), []);

  state = settlePiece(createStackState(), "berry", { x: 0.16, y: 0.7 }).state;
  state = settlePiece(state, "sunny", { x: 0.8, y: 0.7 }).state;
  const localShift = settlePiece(state, "leaf", { x: 0.8, y: 0.75 });
  assert.equal(localShift.settledAs, "floor");
  assert.ok(localShift.piece.x > 0.5);
});

test("broad drops above a placed piece settle into a stable stack", () => {
  let state = settlePiece(createStackState(), "sky", { x: 0.5, y: 0.7 }).state;
  const result = settlePiece(state, "berry", { x: 0.57, y: 0.45 });
  assert.equal(result.settledAs, "stacked");
  assert.equal(result.piece.x, 0.5);
  assert.ok(result.relations.some((relation) => relation.type === "stacked" && relation.with === "sky"));
});

test("ball and nest snap together from a forgiving neighborhood", () => {
  let state = settlePiece(createStackState(), "nest", { x: 0.6, y: 0.7 }).state;
  const result = settlePiece(state, "sunny", { x: 0.72, y: 0.66 });
  assert.equal(result.settledAs, "nested");
  assert.equal(result.piece.x, 0.6);
  assert.ok(result.relations.some((relation) => relation.type === "nested" && relation.with === "nest"));
});

test("a beam spans two forgiving supports and a roof recognizes shelter", () => {
  let state = settlePiece(createStackState(), "berry", { x: 0.38, y: 0.7 }).state;
  state = settlePiece(state, "nest", { x: 0.62, y: 0.7 }).state;
  const bridge = settlePiece(state, "sky", { x: 0.5, y: 0.48 });
  assert.equal(bridge.settledAs, "bridge");
  assert.ok(bridge.structures.some((structure) => structure.type === "bridge"));
  state = settlePiece(bridge.state, "sunny", { x: 0.5, y: 0.64 }).state;
  const roof = settlePiece(state, "leaf", { x: 0.5, y: 0.32 });
  assert.ok(structuresFor(roof.state).some((structure) => ["shelter", "enclosure"].includes(structure.type)));
});

test("a broad beam drop finds a nearby compatible support pair", () => {
  let state = settlePiece(createStackState(), "berry", { x: 0.31, y: 0.72 }).state;
  state = settlePiece(state, "nest", { x: 0.67, y: 0.72 }).state;
  const bridge = settlePiece(state, "sky", { x: 0.67, y: 0.43 });
  assert.equal(bridge.settledAs, "bridge");
  assert.equal(bridge.piece.x, 0.49);
  assert.ok(bridge.structures.some(({ type }) => type === "bridge"));
  assert.deepEqual(unintendedOverlapsFor(bridge.state), []);
});

test("the spotted bird visits only a child-built bridge", () => {
  const layout = { width: 390, height: 844 };
  const initial = createStackState();
  assert.equal(stackResidentFor(initial, layout), null);

  let state = settlePiece(initial, "berry", { x: 0.38, y: 0.7 }, layout).state;
  state = settlePiece(state, "nest", { x: 0.62, y: 0.7 }, layout).state;
  const residentBeforeBridge = stackResidentFor(state, layout);
  assert.equal(residentBeforeBridge, null);

  state = settlePiece(state, "sky", { x: 0.5, y: 0.48 }, layout).state;
  const resident = stackResidentFor(state, layout);
  assert.deepEqual(resident.anchorIds, ["sky", "berry", "nest"]);
  assert.equal(resident.type, "bird");
  assert.equal(resident.x, state.pieces.find(({ id }) => id === "sky").x);
  assert.ok(resident.y >= BUILD_TOP && resident.y < state.pieces.find(({ id }) => id === "sky").y);
  assert.equal(STACK_RESIDENT_TOUCHES, 4);
});

test("the bridge bird has four bounded local visit positions", () => {
  const layout = { width: 800, height: 320 };
  let state = settlePiece(createStackState(), "berry", { x: 0.44, y: 0.7 }, layout).state;
  state = settlePiece(state, "nest", { x: 0.56, y: 0.7 }, layout).state;
  state = settlePiece(state, "sky", { x: 0.5, y: 0.48 }, layout).state;
  const resident = stackResidentFor(state, layout);
  const positions = Array.from({ length: STACK_RESIDENT_TOUCHES }, (_, visit) => moveStackResident(resident, visit, layout));
  assert.equal(new Set(positions.map(({ x, y }) => `${x}:${y}`)).size, STACK_RESIDENT_TOUCHES);
  assert.equal(positions.every(({ x, y }) => x >= 0.06 && x <= 0.94 && y >= BUILD_TOP && y < FLOOR_Y), true);
  assert.deepEqual(moveStackResident(resident, STACK_RESIDENT_TOUCHES, layout), positions[0]);
  assert.throws(() => moveStackResident(resident, -1, layout), RangeError);
  assert.throws(() => moveStackResident({ ...resident, type: "bee" }, 0, layout), TypeError);
});

test("idea matching recognizes broad structural relationships without changing state", () => {
  const initial = createStackState();
  let bridgeState = settlePiece(initial, "berry", { x: 0.38, y: 0.7 }).state;
  bridgeState = settlePiece(bridgeState, "nest", { x: 0.62, y: 0.7 }).state;
  bridgeState = settlePiece(bridgeState, "sky", { x: 0.5, y: 0.48 }).state;
  assert.equal(matchesStackIdea(bridgeState, "bridge"), true);
  assert.equal(matchesStackIdea(initial, "bridge"), false);

  let nestedState = settlePiece(initial, "nest", { x: 0.6, y: 0.7 }).state;
  nestedState = settlePiece(nestedState, "sunny", { x: 0.64, y: 0.66 }).state;
  assert.equal(matchesStackIdea(nestedState, "nest"), true);
  assert.equal(initial.pieces.every((piece) => !piece.placed), true);
});

test("idea matching accepts multiple stack and row arrangements", () => {
  let tower = settlePiece(createStackState(), "sky", { x: 0.5, y: 0.7 }).state;
  tower = settlePiece(tower, "berry", { x: 0.5, y: 0.48 }).state;
  tower = settlePiece(tower, "leaf", { x: 0.5, y: 0.3 }).state;
  assert.equal(matchesStackIdea(tower, "tower"), true);

  let row = settlePiece(createStackState(), "berry", { x: 0.2, y: 0.7 }).state;
  row = settlePiece(row, "sky", { x: 0.46, y: 0.7 }).state;
  row = settlePiece(row, "nest", { x: 0.78, y: 0.7 }).state;
  assert.equal(matchesStackIdea(row, "beside"), true);
  assert.throws(() => matchesStackIdea(row, "missing"), RangeError);
});

test("many arbitrary placements preserve identity, bounds, and recoverability", () => {
  let state = createStackState();
  for (let move = 0; move < 500; move += 1) {
    const piece = STACK_PIECES[move % STACK_PIECES.length];
    const layout = move % 2 ? { width: 320, height: 640 } : { width: 800, height: 320 };
    state = settlePiece(state, piece.id, { x: ((move * 37) % 101) / 100, y: ((move * 53) % 79) / 100 }, layout).state;
    assert.equal(new Set(state.pieces.map((item) => item.id)).size, STACK_PIECES.length);
    assert.equal(state.pieces.every((item) => item.x >= 0 && item.x <= 1 && item.y >= 0 && item.y <= 1), true);
    assert.deepEqual(unintendedOverlapsFor(state, layout), []);
  }
});

test("orientation changes reflow collisions without losing any piece", () => {
  let state = settlePiece(createStackState(), "berry", { x: 0.34, y: 0.7 }, { width: 320, height: 640 }).state;
  state = settlePiece(state, "nest", { x: 0.58, y: 0.7 }, { width: 320, height: 640 }).state;
  const landscape = resolveStackLayout(state, { width: 800, height: 320 });
  assert.equal(landscape.pieces.filter(({ placed }) => placed).length, 2);
  assert.deepEqual(unintendedOverlapsFor(landscape, { width: 800, height: 320 }), []);
});

test("orientation changes preserve an existing bridge and its resident", () => {
  const portrait = { width: 390, height: 844 };
  const landscape = { width: 640, height: 360 };
  let state = settlePiece(createStackState(), "berry", { x: 0.38, y: 0.7 }, portrait).state;
  state = settlePiece(state, "nest", { x: 0.62, y: 0.7 }, portrait).state;
  state = settlePiece(state, "sky", { x: 0.5, y: 0.48 }, portrait).state;
  assert.ok(structuresFor(state, portrait).some(({ type }) => type === "bridge"));

  const reflowed = resolveStackLayout(state, landscape, portrait);
  assert.equal(reflowed.pieces.filter(({ placed }) => placed).length, 3);
  assert.ok(structuresFor(reflowed, landscape).some(({ type }) => type === "bridge"));
  assert.equal(stackResidentFor(reflowed, landscape)?.type, "bird");
  assert.deepEqual(unintendedOverlapsFor(reflowed, landscape), []);
});

test("nearby floor pieces form a side-by-side relation", () => {
  let state = settlePiece(createStackState(), "berry", { x: 0.3, y: 0.7 }).state;
  state = settlePiece(state, "sky", { x: 0.58, y: 0.7 }).state;
  assert.ok(relationshipsFor(state, "berry").some((relation) => relation.type === "beside"));
});

test("tap-only play places and then rearranges pieces", () => {
  let state = createStackState();
  const first = tapPiece(state, "berry");
  state = first.state;
  const second = tapPiece(state, "sky");
  assert.equal(first.piece.placed, true);
  assert.equal(second.piece.placed, true);
  assert.ok(second.piece.moves > 0);
  const movedAgain = tapPiece(second.state, "berry");
  assert.equal(movedAgain.piece.moves, 2);
});

test("settling geometry remains stable in portrait and short landscape layouts", () => {
  const portrait = { width: 320, height: 640 };
  const landscape = { width: 800, height: 320 };
  const portraitFloor = settlePiece(createStackState(), "berry", { x: 0.5, y: 0.6 }, portrait);
  const landscapeFloor = settlePiece(createStackState(), "berry", { x: 0.5, y: 0.6 }, landscape);
  const berry = STACK_PIECES.find((piece) => piece.id === "berry");
  assert.equal(portraitFloor.piece.y + ((berry.height * 320 / 640) / 2), FLOOR_Y);
  assert.equal(landscapeFloor.piece.y + (berry.height / 2), FLOOR_Y);

  let portraitState = settlePiece(createStackState(), "nest", { x: 0.55, y: 0.6 }, portrait).state;
  const nested = settlePiece(portraitState, "sunny", { x: 0.63, y: 0.7 }, portrait);
  assert.equal(nested.settledAs, "nested");
  assert.ok(nested.relations.some((relation) => relation.type === "nested"));
});

test("invalid state, piece, and points are rejected", () => {
  const state = createStackState();
  assert.throws(() => settlePiece(state, "missing", { x: 0.5, y: 0.5 }), RangeError);
  assert.throws(() => settlePiece(state, "berry", { x: NaN, y: 0.5 }), TypeError);
  assert.throws(() => relationshipsFor({ pieces: [] }, "berry"), RangeError);
});
