import { createTonePlayer } from "./audio.js";
import { STACK_PIECES, createStackState, settlePiece, tapPiece } from "./stack.js";
import { loadSoundPreference, saveSoundPreference } from "./settings.js";

const buildArea = document.querySelector("#build-area");
const piecesElement = document.querySelector("#pieces");
const message = document.querySelector("#stack-message");
const announcement = document.querySelector("#announcement");
const soundToggle = document.querySelector("#sound-toggle");

let state = createStackState();
let soundEnabled = loadSoundPreference();
let drag = null;
let suppressClickFor = null;
const tonePlayer = createTonePlayer({ initialEnabled: soundEnabled });

function renderSoundState() {
  soundToggle.setAttribute("aria-pressed", String(soundEnabled));
  soundToggle.setAttribute("aria-label", soundEnabled ? "Turn sound off" : "Turn sound on");
}

function createPieces() {
  const fragment = document.createDocumentFragment();
  for (const definition of STACK_PIECES) {
    const piece = document.createElement("button");
    const shape = document.createElement("span");
    piece.type = "button";
    piece.className = "stack-piece";
    piece.dataset.id = definition.id;
    piece.dataset.kind = definition.kind;
    piece.style.setProperty("--piece-width", `${definition.width * 100}vmin`);
    piece.style.setProperty("--piece-height", `${definition.height * 100}vmin`);
    piece.setAttribute("aria-label", `${definition.kind} piece; tap to place or move`);
    shape.className = "piece-shape";
    shape.setAttribute("aria-hidden", "true");
    piece.append(shape);
    fragment.append(piece);
  }
  piecesElement.replaceChildren(fragment);
  renderPieces();
}

function renderPieces() {
  for (const piece of state.pieces) {
    const element = piecesElement.querySelector(`[data-id="${piece.id}"]`);
    element.style.setProperty("--x", piece.x);
    element.style.setProperty("--y", piece.y);
    element.dataset.placed = String(piece.placed);
    element.style.zIndex = String(5 + Math.round((1 - piece.y) * 100) + (piece.kind === "ball" ? 10 : 0));
  }
}

function animatePiece(id, className = "settled") {
  const element = piecesElement.querySelector(`[data-id="${id}"]`);
  element.classList.remove("settled", "related");
  void element.offsetWidth;
  element.classList.add(className);
}

function describeResult(result) {
  const strongest = result.relations.find((relation) => relation.type === "nested")
    || result.relations.find((relation) => relation.type === "stacked")
    || result.relations.find((relation) => relation.type === "beside");
  if (!strongest) return "Settled safely!";
  if (strongest.type === "nested") return "Snuggled inside!";
  if (strongest.type === "stacked") return "Stacked together!";
  return "Side by side!";
}

function applyResult(result) {
  state = result.state;
  renderPieces();
  animatePiece(result.piece.id);
  for (const relation of result.relations) animatePiece(relation.with, "related");
  const definition = STACK_PIECES.find((piece) => piece.id === result.piece.id);
  const text = describeResult(result);
  message.textContent = text;
  announcement.textContent = `${definition.kind} ${text.toLowerCase()}`;
  const lift = result.relations.length ? 1.15 : 1;
  tonePlayer.play(definition.tone * lift);
}

function normalizedPoint(event) {
  const bounds = buildArea.getBoundingClientRect();
  return {
    x: (event.clientX - bounds.left) / bounds.width,
    y: (event.clientY - bounds.top) / bounds.height
  };
}

function currentLayout() {
  const bounds = buildArea.getBoundingClientRect();
  return { width: bounds.width, height: bounds.height };
}

piecesElement.addEventListener("pointerdown", (event) => {
  const piece = event.target.closest(".stack-piece");
  if (!piece) return;
  event.preventDefault();
  piece.setPointerCapture?.(event.pointerId);
  drag = {
    id: piece.dataset.id,
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    moved: false
  };
});

piecesElement.addEventListener("pointermove", (event) => {
  if (!drag || event.pointerId !== drag.pointerId) return;
  const piece = piecesElement.querySelector(`[data-id="${drag.id}"]`);
  const distance = Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY);
  if (!drag.moved && distance < 8) return;
  drag.moved = true;
  piece.classList.add("dragging");
  const point = normalizedPoint(event);
  piece.style.setProperty("--x", Math.min(Math.max(point.x, 0), 1));
  piece.style.setProperty("--y", Math.min(Math.max(point.y, 0), 1));
});

function endDrag(event) {
  if (!drag || event.pointerId !== drag.pointerId) return;
  const current = drag;
  drag = null;
  const piece = piecesElement.querySelector(`[data-id="${current.id}"]`);
  piece.classList.remove("dragging");
  if (event.type === "pointercancel") {
    renderPieces();
    return;
  }
  if (!current.moved) return;
  suppressClickFor = current.id;
  setTimeout(() => {
    if (suppressClickFor === current.id) suppressClickFor = null;
  }, 0);
  applyResult(settlePiece(state, current.id, normalizedPoint(event), currentLayout()));
}

for (const eventName of ["pointerup", "pointercancel", "lostpointercapture"]) {
  piecesElement.addEventListener(eventName, endDrag);
}

piecesElement.addEventListener("click", (event) => {
  const piece = event.target.closest(".stack-piece");
  if (!piece) return;
  if (suppressClickFor === piece.dataset.id) {
    suppressClickFor = null;
    return;
  }
  applyResult(tapPiece(state, piece.dataset.id, currentLayout()));
});

soundToggle.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  tonePlayer.setEnabled(soundEnabled);
  saveSoundPreference(soundEnabled);
  renderSoundState();
  if (soundEnabled) tonePlayer.play(440);
});

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") void tonePlayer.suspend();
});
addEventListener("pagehide", tonePlayer.stop);

createPieces();
renderSoundState();

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  const workerUrl = new URL("../sw.js", import.meta.url);
  addEventListener("load", () => navigator.serviceWorker.register(workerUrl));
}
