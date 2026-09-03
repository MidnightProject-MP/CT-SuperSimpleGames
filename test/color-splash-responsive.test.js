import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createBoard, floodRegion } from "../src/flood.js";

const root = resolve(import.meta.dirname, "..");
const css = readFileSync(resolve(root, "color-splash.css"), "utf8");
const runtime = readFileSync(resolve(root, "src/color-splash.js"), "utf8");

// Pure transpose helper mirrored from src/color-splash.js for testing
function transposeBoard(source) {
  const src = createBoard(source);
  const newWidth = src.height;
  const newHeight = src.width;
  const cells = new Uint8Array(src.cells.length);
  for (let r = 0; r < src.height; r += 1) {
    for (let c = 0; c < src.width; c += 1) {
      const oldIndex = r * src.width + c;
      const newIndex = c * newWidth + r;
      cells[newIndex] = src.cells[oldIndex];
    }
  }
  return createBoard({ width: newWidth, height: newHeight, colorCount: src.colorCount, cells });
}

test("Color Splash uses dynamic play rectangle with grid areas", () => {
  assert.match(css, /\.splash-game\s*\{[^}]*grid-template-areas:\s*"controls"\s*"play"/s);
  assert.match(css, /\.splash-game\s*\{[^}]*height:\s*100dvh/s);
  assert.match(css, /\.board-shell\s*\{[^}]*grid-area:\s*play/s);
  assert.match(css, /\.splash-topbar\s*\{[^}]*grid-area:\s*controls/s);
  assert.match(css, /@media\s*\(orientation:\s*landscape\)\s*\{[^}]*grid-template-columns:\s*auto\s+minmax\(0,\s*1fr\)/s);
});

test("Color Splash cells remain square via --cell-size, --cols, --rows", () => {
  assert.match(css, /\.color-board\s*\{[^}]*--cell-size/s);
  assert.match(css, /\.color-board\s*\{[^}]*--cols/s);
  assert.match(css, /\.color-board\s*\{[^}]*--rows/s);
  assert.match(css, /\.color-board\s*\{[^}]*grid-template-columns:\s*repeat\(var\(--cols\)/s);
  assert.match(css, /\.color-board\s*\{[^}]*grid-template-rows:\s*repeat\(var\(--rows\)/s);
  assert.doesNotMatch(css, /--board-size:\s*min\(/);
});

test("header is icon-only with accessible label preserved", () => {
  assert.match(css, /\.splash-brand\s*>\s*span:last-child\s*\{[^}]*position:\s*absolute/s);
  assert.match(css, /\.splash-brand\s*\{[^}]*min-width:\s*44px/s);
  // Runtime should still have aria-label via sound toggle and home link
  assert.match(runtime, /aria-label/);
});

test("prompt is compact and not prime play space", () => {
  assert.match(css, /\.splash-prompt\s*\{[^}]*font-size:\s*clamp\(14px/);
  assert.match(css, /\.splash-prompt\s*\{[^}]*padding:\s*4px 12px/s);
});

test("transposeBoard preserves top-left, identity, adjacency, and is invertible", () => {
  const board = createBoard({ width: 3, height: 4, colorCount: 4, cells: Uint8Array.from([0,1,2, 3,0,1, 2,3,0, 1,2,3]) });
  const transposed = transposeBoard(board);
  assert.equal(transposed.width, 4);
  assert.equal(transposed.height, 3);
  assert.equal(transposed.cells.length, 12);
  // top-left stays
  assert.equal(transposed.cells[0], board.cells[0]);
  // check mapping (r,c)->(c,r)
  for (let r = 0; r < board.height; r++) {
    for (let c = 0; c < board.width; c++) {
      const oldIdx = r * board.width + c;
      const newIdx = c * transposed.width + r;
      assert.equal(transposed.cells[newIdx], board.cells[oldIdx], `cell (${r},${c})`);
    }
  }
  // double transpose returns original
  const double = transposeBoard(transposed);
  assert.deepEqual(Array.from(double.cells), Array.from(board.cells));
  assert.equal(double.width, board.width);
  assert.equal(double.height, board.height);
});

test("transposeBoard preserves flood region size and orthogonal adjacency", () => {
  const board = createBoard({ width: 3, height: 4, colorCount: 2, cells: Uint8Array.from([0,0,1, 0,1,1, 1,1,0, 0,0,0]) });
  const before = floodRegion(board).length;
  const transposed = transposeBoard(board);
  const after = floodRegion(transposed).length;
  assert.equal(before, after);
});

test("visible play surface ≅ forgiving tap: resolveTile only within shell margin", () => {
  assert.match(runtime, /boardShell\.getBoundingClientRect/);
  assert.match(runtime, /margin = 16/);
  assert.match(runtime, /if \(event\.clientX < shellRect\.left - margin/);
  assert.doesNotMatch(runtime, /document\.addEventListener\("click"/); // now scoped to boardShell
  assert.match(runtime, /boardShell\.addEventListener\("click", handleBoardTap\)/);
});

test("no accidental complexity increase from viewport dimensions", () => {
  // Runtime should cap cell at 120 and keep ≤16 cells, so larger screen ≠ harder
  assert.match(runtime, /Math\.max\(44, Math\.min\(120/);
  assert.match(runtime, /GRID_OPTIONS/);
  assert.match(runtime, /width: 3, height: 4/);
  assert.match(runtime, /width: 4, height: 3/);
});
