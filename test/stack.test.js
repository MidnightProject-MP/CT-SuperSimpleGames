import test from "node:test";
import assert from "node:assert/strict";
import {
  FLOOR_Y,
  STACK_PIECES,
  createStackState,
  relationshipsFor,
  settlePiece,
  tapPiece
} from "../src/stack.js";

test("stack state starts bounded, distinct, and reusable", () => {
  const state = createStackState();
  assert.equal(state.pieces.length, STACK_PIECES.length);
  assert.equal(new Set(state.pieces.map((piece) => piece.id)).size, STACK_PIECES.length);
  assert.equal(state.pieces.every((piece) => !piece.placed && piece.moves === 0), true);
  assert.equal(Object.isFrozen(state), true);
  assert.equal(Object.isFrozen(state.pieces), true);
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

test("nearby floor pieces form a side-by-side relation", () => {
  let state = settlePiece(createStackState(), "berry", { x: 0.35, y: 0.7 }).state;
  state = settlePiece(state, "sky", { x: 0.56, y: 0.7 }).state;
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
