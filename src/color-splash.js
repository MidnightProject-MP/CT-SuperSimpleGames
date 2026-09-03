import { createTonePlayer } from "./audio.js";
import { COLORS } from "./game.js";
import { nearestTargetIndex } from "./color-input.js";
import { floodRegion, resolveFloodChoice, createBoard } from "./flood.js";
import { loadSoundPreference, saveSoundPreference } from "./settings.js";
import { createSplashBoard, SPLASH_COLOR_COUNT } from "./splash-boards.js";
import { generateBoard } from "./flood.js";
import { startWindDown } from "./wind-down.js";
import { RESIDENT_TOUCHES, attachResident, colorSplashResidentFor } from "./residents.js";
import { protectPlaySurface } from "./play-gesture.js";

const GRID_COLORS = COLORS.slice(0, 4);
const SYMBOLS = ["●", "◆", "≡", "✦"];
const boardIdentityCount = SPLASH_COLOR_COUNT;

const boardElement = document.querySelector("#color-board");
const prompt = document.querySelector("#splash-prompt");
const announcement = document.querySelector("#announcement");
const soundToggle = document.querySelector("#sound-toggle");
const boardShell = document.querySelector(".board-shell");

let board;
let complete = false;
let round = 0;
let soundEnabled = loadSoundPreference();
let residentTouchesLeft = RESIDENT_TOUCHES;
let residentSpot = 0;
const tonePlayer = createTonePlayer({ initialEnabled: soundEnabled });

function nextSeed() {
  try {
    const value = new Uint32Array(1);
    crypto.getRandomValues(value);
    return value[0] ^ round;
  } catch {
    return (Date.now() ^ (round * 0x9e3779b9)) >>> 0;
  }
}

// --- Responsive geometry: discrete grid selection ---

// Discrete grid options per complexity step. Teaching is always 2×2.
// Main step exposes several transpose-paired candidates so the chooser can
// select the best fit for the *actual* available aspect ratio — e.g. tall
// 3×4 ↔ wide 4×3 (12), tall 3×5 ↔ wide 5×3 (15), and square 4×4 (16).
// All ≤16 so larger screen does not mean harder.
const GRID_OPTIONS = Object.freeze([
  { width: 2, height: 2 }, // teaching
  { width: 3, height: 4 },
  { width: 4, height: 3 },
  { width: 3, height: 5 },
  { width: 5, height: 3 },
  { width: 4, height: 4 },
]);

function isTeachingRound(r) {
  return r <= 3;
}

function getAvailableRect() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const isPortrait = vh >= vw;
  const topBarH = 48;
  const railW = 56;
  const promptRect = prompt.getBoundingClientRect();
  const promptVisible = prompt.offsetParent !== null && getComputedStyle(prompt).display !== "none" && promptRect.height > 0;
  const promptH = promptVisible ? promptRect.height + 6 : 0;
  if (isPortrait) {
    return { width: vw - 24, height: vh - topBarH - promptH - 16 };
  }
  return { width: vw - railW - 24, height: vh - promptH - 16 };
}

// Complexity steps for this slice: 0 = teaching (2×2), 1 = main (up to 16 cells).
// Each step exposes a small set of transpose-paired discrete grids; the chooser
// then selects the best fit for the *actual* available aspect ratio.
function gridsForStep(step) {
  if (step === 0) return [{ width: 2, height: 2 }];
  // Main step: several transpose pairs so tall vs wide rectangles can be
  // filled efficiently with large square targets. All ≤16 so larger screen
  // does not imply harder puzzle.
  return [
    { width: 3, height: 4 }, // 12 tall
    { width: 4, height: 3 }, // 12 wide (transpose)
    { width: 3, height: 5 }, // 15 tall
    { width: 5, height: 3 }, // 15 wide (transpose)
    { width: 4, height: 4 }, // 16 square
  ];
}

function chooseGrid(availW, availH, teachingOrStep) {
  // Back-compat: teaching boolean still supported, but prefer step number.
  const step = typeof teachingOrStep === "number" ? teachingOrStep : (teachingOrStep ? 0 : 1);
  const candidates = gridsForStep(step);
  let best = null;
  for (const g of candidates) {
    const gap = 8;
    const pad = 24;
    const cellByW = Math.floor((availW - pad - (g.width - 1) * gap) / g.width);
    const cellByH = Math.floor((availH - pad - (g.height - 1) * gap) / g.height);
    const cell = Math.min(cellByW, cellByH);
    if (cell < 44) continue;
    const boardW = cell * g.width + (g.width - 1) * gap + pad;
    const boardH = cell * g.height + (g.height - 1) * gap + pad;
    const utilization = (boardW * boardH) / (availW * availH);
    // No arbitrary maximum cell size — huge toddler targets are not a problem.
    // Score prefers larger cells and better fill of the actual rectangle.
    const score = cell * 0.85 + utilization * 100 * 0.15;
    if (!best || score > best.score) best = { ...g, cell, boardW, boardH, utilization, score };
  }
  const chosen = best ? { width: best.width, height: best.height } : { width: 4, height: 4 };
  return chosen;
}

export function boardSizeForViewport() {
  const teaching = isTeachingRound(round);
  const avail = getAvailableRect();
  const step = teaching ? 0 : 1;
  return chooseGrid(avail.width, avail.height, step);
}

// Pure transpose: (r,c) → (c,r), dimensions swap, preserves top-left, identity, adjacency.
export function transposeBoard(source) {
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

function applyBoardGeometry() {
  if (!board) return;
  const avail = getAvailableRect();
  const gap = 8;
  const pad = 24;
  const cellByW = Math.floor((avail.width - pad - (board.width - 1) * gap) / board.width);
  const cellByH = Math.floor((avail.height - pad - (board.height - 1) * gap) / board.height);
  let cell = Math.min(cellByW, cellByH);
  cell = Math.max(44, cell);
  // No arbitrary maximum — huge toddler targets are not a problem; minimum
  // ensures comfort, available rectangle caps the board.
  boardElement.style.setProperty("--cell-size", `${cell}px`);
  boardElement.style.setProperty("--cols", String(board.width));
  boardElement.style.setProperty("--rows", String(board.height));
  boardElement.style.setProperty("--board-width", String(board.width));
  boardElement.style.setProperty("--board-height", String(board.height));
}

function renderSoundState() {
  soundToggle.setAttribute("aria-pressed", String(soundEnabled));
  soundToggle.setAttribute("aria-label", soundEnabled ? "Turn sound off" : "Turn sound on");
}

function applyTileAppearance(tile, colorIndex, captured) {
  const color = GRID_COLORS[colorIndex];
  tile.dataset.color = String(colorIndex);
  tile.style.setProperty("--tile", color.petal);
  tile.style.setProperty("--tile-light", color.light);
  tile.style.setProperty("--tile-dark", color.petal);
  tile.querySelector(".cell-symbol").textContent = SYMBOLS[colorIndex];
  tile.classList.toggle("captured", captured);
  tile.setAttribute("aria-label", `${color.name} square${tile.dataset.index === "0" ? ", growing corner" : ""}`);
}

function createTiles() {
  const fragment = document.createDocumentFragment();
  boardElement.style.setProperty("--board-width", String(board.width));
  boardElement.style.setProperty("--board-height", String(board.height));
  boardElement.style.setProperty("--cols", String(board.width));
  boardElement.style.setProperty("--rows", String(board.height));
  boardElement.classList.toggle("teaching-board", board.cells.length === 4);
  for (let index = 0; index < board.cells.length; index += 1) {
    const tile = document.createElement("button");
    tile.className = "color-cell";
    tile.type = "button";
    tile.dataset.index = String(index);
    if (index === 0) tile.classList.add("anchor");
    const symbol = document.createElement("span");
    symbol.className = "cell-symbol";
    symbol.setAttribute("aria-hidden", "true");
    tile.append(symbol);
    fragment.append(tile);
  }
  const travel = document.createElement("span");
  travel.className = "color-travel";
  travel.setAttribute("aria-hidden", "true");
  fragment.append(travel);
  boardElement.replaceChildren(fragment);
  applyBoardGeometry();
}

function renderBoard(animated = []) {
  const captured = new Set(floodRegion(board));
  const animatedIndices = new Set(animated);

  for (const tile of boardElement.querySelectorAll(".color-cell")) {
    const index = Number(tile.dataset.index);
    applyTileAppearance(tile, board.cells[index], captured.has(index));
    tile.classList.remove("splashing", "pressed");
    if (!animatedIndices.has(index)) continue;
    void tile.offsetWidth;
    tile.classList.add("splashing");
  }
}

function clearPreview() {
  for (const tile of boardElement.querySelectorAll(".preview-captured, .preview-choice")) tile.classList.remove("preview-captured", "preview-choice");
}

function previewChoice(tile) {
  if (!tile || complete) return;
  clearPreview();
  const result = resolveFloodChoice(board, Number(tile.dataset.index));
  for (const index of result.captured) boardElement.querySelector(`[data-index="${index}"]`)?.classList.add("preview-captured");
  tile.classList.add("preview-choice");
}

function newRound({ playSound = false } = {}) {
  round += 1;
  const teaching = isTeachingRound(round);
  const size = boardSizeForViewport();
  if (teaching) {
    board = createSplashBoard({ round, seed: nextSeed(), width: size.width, height: size.height, colorCount: boardIdentityCount });
  } else {
    // Main play: use responsive discrete grid directly, not the fixed 4×4 designed
    // pattern, so the physical board can fill the available rectangle with large
    // square targets. Keeps ≤16 cells so larger screen ≠ harder.
    const gen = generateBoard({ width: size.width, height: size.height, colorCount: boardIdentityCount, seed: nextSeed() });
    board = { ...gen, family: "mixed", label: "Color islands" };
  }
  complete = false;
  prompt.textContent = board.label;
  boardElement.classList.remove("complete");
  createTiles();
  renderBoard();
  announcement.textContent = `New ${board.label.toLowerCase()} board`;
  if (playSound) tonePlayer.play(GRID_COLORS[board.cells[0]].tone);
  updateResident();
}

function pulseTile(tile) {
  if (!tile) return;
  tile.classList.remove("pressed");
  void tile.offsetWidth;
  tile.classList.add("pressed");
}

function showColorTravel(tile, colorIndex) {
  const travel = boardElement.querySelector(".color-travel");
  const anchor = boardElement.querySelector(".anchor");
  const boardRect = boardElement.getBoundingClientRect();
  const tileRect = tile.getBoundingClientRect();
  const anchorRect = anchor.getBoundingClientRect();
  const startX = ((tileRect.left + tileRect.right) / 2) - boardRect.left;
  const startY = ((tileRect.top + tileRect.bottom) / 2) - boardRect.top;
  const endX = ((anchorRect.left + anchorRect.right) / 2) - boardRect.left;
  const endY = ((anchorRect.top + anchorRect.bottom) / 2) - boardRect.top;

  boardElement.style.setProperty("--travel-x", `${startX}px`);
  boardElement.style.setProperty("--travel-y", `${startY}px`);
  boardElement.style.setProperty("--travel-dx", `${endX - startX}px`);
  boardElement.style.setProperty("--travel-dy", `${endY - startY}px`);
  boardElement.style.setProperty("--travel-color", GRID_COLORS[colorIndex].petal);
  travel.classList.remove("moving");
  void travel.offsetWidth;
  travel.classList.add("moving");
}

function resolveTile(event) {
  // Forgiving hit-box is the visible board plus a small margin, not the entire
  // play pane. This keeps visible ≅ forgiving: near-edge misses resolve
  // generously, but large blank areas of the play pane do not secretly act as
  // board input.
  const literalTile = event.target.closest?.(".color-cell");
  if (literalTile) return literalTile;
  if (!Number.isFinite(event.clientX) || !Number.isFinite(event.clientY)) return null;
  const boardRect = boardElement.getBoundingClientRect();
  const margin = 16;
  if (event.clientX < boardRect.left - margin || event.clientX > boardRect.right + margin ||
      event.clientY < boardRect.top - margin || event.clientY > boardRect.bottom + margin) {
    return null;
  }
  const tiles = [...boardElement.querySelectorAll(".color-cell")];
  if (!tiles.length) return null;
  const index = nearestTargetIndex({
    x: event.clientX,
    y: event.clientY,
    rects: tiles.map((tile) => tile.getBoundingClientRect())
  });
  return tiles[index];
}

const COMPLETION_HOLD_MS = 1500;
let completedAt = 0;

function finishRound(colorIndex) {
  complete = true;
  completedAt = performance.now();
  prompt.textContent = "All filled!";
  boardElement.classList.add("complete");
  announcement.textContent = "All squares filled. Tap anywhere for a new board.";
  tonePlayer.play(GRID_COLORS[colorIndex].tone * 1.25);
  updateResident();
}

function residentLayer() {
  let layer = boardElement.querySelector(".cs-resident-layer");
  if (!layer) {
    layer = document.createElement("div");
    layer.className = "cs-resident-layer";
    boardElement.append(layer);
  }
  return layer;
}

function butterflySpots() {
  const tiles = [...boardElement.querySelectorAll(".color-cell")];
  if (!tiles.length) return [];
  const picks = [...new Set([0, Math.floor(tiles.length / 2), tiles.length - 1])];
  return picks.map((index) => ({
    x: tiles[index].offsetLeft + tiles[index].offsetWidth / 2,
    y: tiles[index].offsetTop + tiles[index].offsetHeight / 2,
  }));
}

function placeButterfly(button, spot) {
  button.style.left = `${spot.x - 42}px`;
  button.style.top = `${spot.y - 42}px`;
}

function touchResident(button) {
  const replay = (className, duration) => {
    button.classList.remove(className);
    void button.offsetWidth;
    button.classList.add(className);
    setTimeout(() => button.classList.remove(className), duration);
  };
  residentTouchesLeft -= 1;
  if (residentTouchesLeft <= 0) {
    replay("leaving", 750);
    setTimeout(() => button.remove(), 760);
    return;
  }
  const spots = butterflySpots();
  residentSpot = (residentSpot + 1) % spots.length;
  placeButterfly(button, spots[residentSpot]);
  replay(residentSpot % 2 ? "gliding" : "flapping", 650);
}

function updateResident() {
  const resident = colorSplashResidentFor({ ...board, completed: complete });
  const layer = boardElement.querySelector(".cs-resident-layer");
  if (!resident) {
    layer?.querySelector(".cs-resident")?.remove();
    return;
  }
  const existing = layer?.querySelector(".cs-resident");
  const spots = butterflySpots();
  if (!spots.length) return;
  if (existing) {
    placeButterfly(existing, spots[residentSpot] ?? spots[0]);
    return;
  }
  residentTouchesLeft = RESIDENT_TOUCHES;
  residentSpot = 0;
  const button = attachResident({
    layer: residentLayer(),
    resident,
    className: "cs-resident",
    label: "A butterfly flutters over the finished board",
    onTouch: touchResident,
  });
  placeButterfly(button, spots[0]);
}

// Tap handling: board-shell is the play surface. Taps on shell background
// still resolve to nearest cell via resolveTile forgiving margin, but far
// background outside shell does not trigger board action — visible ≅ forgiving.
function handleBoardTap(event) {
  if (event.target.closest("a, #sound-toggle")) return;
  const tile = resolveTile(event);
  if (complete) {
    pulseTile(tile);
    if (performance.now() - completedAt >= COMPLETION_HOLD_MS) newRound({ playSound: true });
    return;
  }
  if (!tile) return;
  clearPreview();
  const result = resolveFloodChoice(board, Number(tile.dataset.index));
  const colorIndex = result.selectedIdentity;
  tonePlayer.play(GRID_COLORS[colorIndex].tone);
  pulseTile(tile);
  showColorTravel(tile, colorIndex);

  if (!result.moved) {
    for (const index of result.captured) {
      pulseTile(boardElement.querySelector(`[data-index="${index}"]`));
    }
    announcement.textContent = `${GRID_COLORS[colorIndex].name} again`;
    return;
  }

  board = result.board;
  renderBoard(result.captured);
  announcement.textContent = `${GRID_COLORS[colorIndex].name} grows to ${result.captured.length} squares`;
  if (result.solved) finishRound(colorIndex);
}

// Orientation continuity: preserve logical board via transpose on resize
let lastOrientationIsPortrait = window.innerHeight >= window.innerWidth;
let resizeFrame = 0;
function handleResize() {
  cancelAnimationFrame(resizeFrame);
  resizeFrame = requestAnimationFrame(() => {
    if (!board) return;
    const isPortrait = window.innerHeight >= window.innerWidth;
    const orientationChanged = isPortrait !== lastOrientationIsPortrait;
    lastOrientationIsPortrait = isPortrait;
    if (orientationChanged && board.width !== board.height) {
      // Transpose preserves top-left, identity, adjacency, flood state.
      // Only transpose if the transposed dimensions would still be a valid
      // grid for current avail (prevents 2×2 transpose no-op, and avoids
      // creating an unusual shape if avail is square-ish).
      const transposed = transposeBoard(board);
      // Verify transposed board still fits avail with comfortable cell size
      const avail = getAvailableRect();
      const gap = 8, pad = 24;
      const cellByW = Math.floor((avail.width - pad - (transposed.width - 1) * gap) / transposed.width);
      const cellByH = Math.floor((avail.height - pad - (transposed.height - 1) * gap) / transposed.height);
      const cell = Math.min(cellByW, cellByH);
      if (cell >= 44) {
        board = transposed;
        createTiles();
        renderBoard();
        updateResident();
        return;
      }
    }
    // Otherwise just re-layout current board with new cell size
    applyBoardGeometry();
    updateResident();
  });
}

boardShell.addEventListener("click", handleBoardTap);
boardElement.addEventListener("pointerover", (event) => {
  if (event.pointerType === "touch") return;
  previewChoice(event.target.closest(".color-cell"));
});
boardElement.addEventListener("pointerleave", clearPreview);
boardElement.addEventListener("focusin", (event) => previewChoice(event.target.closest(".color-cell")));
boardElement.addEventListener("focusout", clearPreview);

soundToggle.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  tonePlayer.setEnabled(soundEnabled);
  saveSoundPreference(soundEnabled);
  renderSoundState();
  if (soundEnabled) tonePlayer.play(GRID_COLORS[board.cells[0]].tone);
});

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") void tonePlayer.suspend();
});
addEventListener("pagehide", tonePlayer.stop);
addEventListener("resize", handleResize);

newRound();
renderSoundState();
protectPlaySurface();
startWindDown({ lines: { "/games/color-splash/": "The colors are resting." } });

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  const workerUrl = new URL("../sw.js", import.meta.url);
  addEventListener("load", () => navigator.serviceWorker.register(workerUrl));
}
