import { createTonePlayer } from "./audio.js";
import { COLORS } from "./game.js";
import { nearestTargetIndex } from "./color-input.js";
import { floodRegion, resolveFloodChoice } from "./flood.js";
import { loadSoundPreference, saveSoundPreference } from "./settings.js";
import { createSplashBoard } from "./splash-boards.js";

const GRID_COLORS = COLORS.slice(0, 4);
const SYMBOLS = ["●", "◆", "≡", "✦"];

const boardElement = document.querySelector("#color-board");
const prompt = document.querySelector("#splash-prompt");
const announcement = document.querySelector("#announcement");
const soundToggle = document.querySelector("#sound-toggle");

let board;
let complete = false;
let round = 0;
let soundEnabled = loadSoundPreference();
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

function boardSizeForViewport() {
  const bounds = boardElement.getBoundingClientRect();
  const targetCell = Math.max(64, Math.min(110, Math.round(Math.min(bounds.width, window.innerHeight) / 7)));
  const width = Number.isFinite(bounds.width) && bounds.width > 0
    ? Math.max(4, Math.min(12, Math.floor(bounds.width / targetCell)))
    : 4;
  const height = Number.isFinite(bounds.height) && bounds.height > 40
    ? Math.max(4, Math.min(16, Math.floor(bounds.height / targetCell)))
    : 6;
  return { width, height };
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
  const size = boardSizeForViewport();
  board = createSplashBoard({ round, seed: nextSeed(), width: size.width, height: size.height });
  complete = false;
  prompt.textContent = board.label;
  boardElement.classList.remove("complete");
  createTiles();
  renderBoard();
  announcement.textContent = `New ${board.label.toLowerCase()} board`;
  if (playSound) tonePlayer.play(GRID_COLORS[board.cells[0]].tone);
}

function pulseTile(tile) {
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
  const literalTile = event.target.closest?.(".color-cell");
  if (literalTile) return literalTile;
  if (!Number.isFinite(event.clientX) || !Number.isFinite(event.clientY)) return null;
  const tiles = [...boardElement.querySelectorAll(".color-cell")];
  const index = nearestTargetIndex({
    x: event.clientX,
    y: event.clientY,
    rects: tiles.map((tile) => tile.getBoundingClientRect())
  });
  return tiles[index];
}

function finishRound(colorIndex) {
  complete = true;
  prompt.textContent = "All filled!";
  boardElement.classList.add("complete");
  announcement.textContent = "All squares filled. Tap anywhere for a new board.";
  tonePlayer.play(GRID_COLORS[colorIndex].tone * 1.25);
}

document.addEventListener("click", (event) => {
  if (event.target.closest("a, #sound-toggle")) return;
  const tile = resolveTile(event);

  if (complete) {
    if (tile) pulseTile(tile);
    newRound({ playSound: true });
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
});

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

newRound();
renderSoundState();

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  const workerUrl = new URL("../sw.js", import.meta.url);
  addEventListener("load", () => navigator.serviceWorker.register(workerUrl));
}
