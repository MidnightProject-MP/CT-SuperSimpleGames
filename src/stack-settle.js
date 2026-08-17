import { createTonePlayer } from "./audio.js";
import { STACK_IDEAS, STACK_PIECES, STACK_RESIDENT_TOUCHES, createStackState, matchesStackIdea, moveStackResident, resolveStackLayout, restoreStackState, serializeStackState, settlePiece, stackResidentFor, tapPiece } from "./stack.js";
import { setupFreshStart } from "./fresh-start.js";
import { clearLocalState, loadLocalState, saveLocalState } from "./local-state.js";
import { loadSoundPreference, saveSoundPreference } from "./settings.js";

const buildArea = document.querySelector("#build-area");
const piecesElement = document.querySelector("#pieces");
const residentLayer = document.querySelector("#resident-layer");
const message = document.querySelector("#stack-message");
const announcement = document.querySelector("#announcement");
const soundToggle = document.querySelector("#sound-toggle");
const ideaCard = document.querySelector("#idea-card");
const ideaName = document.querySelector("#idea-name");
const ideaHint = document.querySelector("#idea-hint");
const ideaPicture = document.querySelector("#idea-picture");
const hideIdeaButton = document.querySelector("#hide-idea");
const showIdeaButton = document.querySelector("#show-idea");

const STACK_STORAGE_KEY = "supersimplegames.stack.creation";
let state = createStackState();
let previousLayout = null;
try {
  const saved = loadLocalState(STACK_STORAGE_KEY);
  if (saved) {
    state = restoreStackState(saved);
    if (Number.isFinite(saved.layout?.width) && saved.layout.width >= 100 && saved.layout.width <= 10000
      && Number.isFinite(saved.layout?.height) && saved.layout.height >= 100 && saved.layout.height <= 10000) previousLayout = saved.layout;
  }
} catch {
  clearLocalState(STACK_STORAGE_KEY);
}
let soundEnabled = loadSoundPreference();
let drag = null;
let suppressClickFor = null;
let ideaIndex = 0;
let ideaVisible = true;
let residentState = null;
let dismissedResidentKey = null;
const acknowledgedIdeas = new Set();
const tonePlayer = createTonePlayer({ initialEnabled: soundEnabled });

function residentKey(resident) {
  return resident ? resident.anchorIds.join("-") : null;
}

function createResidentElement() {
  const button = document.createElement("button");
  const art = document.createElement("span");
  button.type = "button";
  button.className = "stack-resident";
  button.setAttribute("aria-label", "The spotted bird is perched on your bridge; touch to say hello");
  art.className = "stack-resident-art";
  art.setAttribute("aria-hidden", "true");
  art.append(document.createElement("i"), document.createElement("i"), document.createElement("i"));
  button.append(art);
  return button;
}

function placeResident() {
  const element = residentLayer.querySelector(".stack-resident");
  if (!element || !residentState) return;
  const point = moveStackResident(residentState.resident, residentState.visits, currentLayout());
  element.style.left = `${point.x * 100}%`;
  element.style.top = `${point.y * 100}%`;
}

function renderResident({ announce = false } = {}) {
  const resident = stackResidentFor(state, currentLayout());
  const key = residentKey(resident);
  if (!resident) {
    residentState = null;
    dismissedResidentKey = null;
    residentLayer.replaceChildren();
    return;
  }
  if (key === dismissedResidentKey) {
    residentState = null;
    residentLayer.replaceChildren();
    return;
  }
  if (residentState?.key === key) {
    residentState = { ...residentState, resident };
    placeResident();
    return;
  }
  residentState = { key, resident, visits: 0 };
  residentLayer.replaceChildren(createResidentElement());
  placeResident();
  if (announce) {
    message.textContent = "The spotted bird found your bridge!";
    announcement.textContent = "The spotted bird came from the garden and perched on your bridge.";
    tonePlayer.play(554.37, 0.16);
  }
}

function renderIdea() {
  const idea = STACK_IDEAS[ideaIndex];
  ideaCard.hidden = !ideaVisible;
  hideIdeaButton.hidden = !ideaVisible;
  showIdeaButton.hidden = ideaVisible;
  ideaCard.dataset.idea = idea.id;
  ideaPicture.dataset.idea = idea.id;
  ideaName.textContent = idea.label;
  ideaHint.textContent = idea.hint;
  ideaCard.setAttribute("aria-label", `${idea.label}. ${idea.hint} Tap for another idea.`);
}

function acknowledgeIdea() {
  if (!ideaVisible) return;
  const idea = STACK_IDEAS[ideaIndex];
  if (!matchesStackIdea(state, idea.id, currentLayout()) || acknowledgedIdeas.has(idea.id)) return;
  acknowledgedIdeas.add(idea.id);
  ideaCard.classList.remove("idea-matched");
  void ideaCard.offsetWidth;
  ideaCard.classList.add("idea-matched");
  message.textContent = `Your ${idea.label.toLowerCase()}!`;
  announcement.textContent = `${idea.label} idea found. Keep building any way you like.`;
  tonePlayer.play(659.25, 0.16);
}

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
  element.classList.remove("settled", "related", "structure-found");
  void element.offsetWidth;
  element.classList.add(className);
}

function describeResult(result) {
  const newestStructure = result.structures.find((structure) => structure.top === result.piece.id);
  if (newestStructure?.type === "enclosure") return "A cozy enclosure!";
  if (newestStructure?.type === "bridge") return "A bridge!";
  if (newestStructure?.type === "shelter") return "A little shelter!";
  const strongest = result.relations.find((relation) => relation.type === "nested")
    || result.relations.find((relation) => relation.type === "stacked")
    || result.relations.find((relation) => relation.type === "beside");
  if (!strongest && result.settledAs === "returned") return "Back to a clear spot!";
  if (!strongest && result.settledAs === "waiting") return "Waiting for a clear spot!";
  if (!strongest && result.collisionResolved) return "Found a clear spot!";
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
  if (result.structures.some((structure) => structure.top === result.piece.id)) animatePiece(result.piece.id, "structure-found");
  const definition = STACK_PIECES.find((piece) => piece.id === result.piece.id);
  const text = describeResult(result);
  message.textContent = text;
  announcement.textContent = `${definition.kind} ${text.toLowerCase()}`;
  const lift = result.relations.length ? 1.15 : 1;
  tonePlayer.play(definition.tone * lift);
  acknowledgeIdea();
  renderResident({ announce: true });
  saveLocalState(STACK_STORAGE_KEY, serializeStackState(state, currentLayout()));
}

function freshStack() {
  state = createStackState();
  acknowledgedIdeas.clear();
  clearLocalState(STACK_STORAGE_KEY);
  renderPieces();
  renderResident();
  message.textContent = "Tap or move a piece!";
  announcement.textContent = "A fresh building space is ready";
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

addEventListener("resize", () => {
  const nextLayout = currentLayout();
  state = resolveStackLayout(state, nextLayout, previousLayout || nextLayout);
  previousLayout = nextLayout;
  renderPieces();
  renderResident();
  acknowledgeIdea();
  saveLocalState(STACK_STORAGE_KEY, serializeStackState(state, nextLayout));
});

residentLayer.addEventListener("click", (event) => {
  const resident = event.target.closest(".stack-resident");
  if (!resident || !residentState) return;
  const visits = residentState.visits + 1;
  if (visits >= STACK_RESIDENT_TOUCHES) {
    dismissedResidentKey = residentState.key;
    residentState = null;
    resident.classList.add("leaving");
    resident.addEventListener("animationend", () => residentLayer.replaceChildren(), { once: true });
    message.textContent = "The spotted bird flew home!";
    announcement.textContent = "The spotted bird flew home. Your bridge is still here.";
    tonePlayer.play(476, 0.16);
    return;
  }
  residentState = { ...residentState, visits };
  placeResident();
  resident.classList.remove("visiting");
  void resident.offsetWidth;
  resident.classList.add("visiting");
  message.textContent = "Hop, little bird!";
  announcement.textContent = "The spotted bird hops along your bridge.";
  tonePlayer.play(554.37 * (1 + visits * 0.025), 0.12);
});

ideaCard.addEventListener("click", () => {
  ideaIndex = (ideaIndex + 1) % STACK_IDEAS.length;
  ideaCard.classList.remove("idea-matched");
  renderIdea();
  announcement.textContent = `${STACK_IDEAS[ideaIndex].label} idea. ${STACK_IDEAS[ideaIndex].hint}`;
  acknowledgeIdea();
});

hideIdeaButton.addEventListener("click", (event) => {
  event.stopPropagation();
  ideaVisible = false;
  renderIdea();
  announcement.textContent = "Building idea hidden. Free building continues.";
});

showIdeaButton.addEventListener("click", () => {
  ideaVisible = true;
  renderIdea();
  announcement.textContent = `${STACK_IDEAS[ideaIndex].label} idea shown.`;
  acknowledgeIdea();
});

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") void tonePlayer.suspend();
});
addEventListener("pagehide", tonePlayer.stop);
addEventListener("pagehide", () => saveLocalState(STACK_STORAGE_KEY, serializeStackState(state, currentLayout())));

const initialLayout = currentLayout();
state = resolveStackLayout(state, initialLayout, previousLayout || initialLayout);
previousLayout = initialLayout;
createPieces();
renderResident();
renderSoundState();
renderIdea();
setupFreshStart({ onConfirm: freshStack });

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  const workerUrl = new URL("../sw.js", import.meta.url);
  addEventListener("load", () => navigator.serviceWorker.register(workerUrl));
}
