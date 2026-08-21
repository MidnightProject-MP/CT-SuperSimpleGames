import { createTonePlayer } from "./audio.js";
import {
  compositionsForScene,
  createSceneState,
  moveSceneObject,
  placeSceneObject,
  relationshipsForScene,
  restoreSceneState,
  serializeSceneState,
  selectSceneKind,
  selectNextSceneKind,
  touchSceneObject,
} from "./story-scene.js";
import { restoreStoryWorld, serializeStoryWorld } from "./story-world.js";
import { STORY_PACKS, getStoryPack, storyCastItem } from "./story-packs.js";
import { loadSoundPreference, saveSoundPreference } from "./settings.js";
import { setupFreshStart } from "./fresh-start.js";
import { clearLocalState, loadLocalState, saveLocalState } from "./local-state.js";

const stage = document.querySelector("#scene-stage");
const objectLayer = document.querySelector("#object-layer");
const relationLayer = document.querySelector("#relation-layer");
const palette = document.querySelector("#story-palette");
const message = document.querySelector("#story-message");
const announcement = document.querySelector("#announcement");
const soundToggle = document.querySelector("#sound-toggle");
const backgroundButton = document.querySelector("#background-button");
const backgroundPicker = document.querySelector("#background-picker");
const backgroundOptions = document.querySelector("#background-options");
const backgroundCancel = document.querySelector("#background-cancel");

const KEYBOARD_POINTS = Object.freeze([
  Object.freeze({ x: 0.3, y: 0.66 }),
  Object.freeze({ x: 0.5, y: 0.52 }),
  Object.freeze({ x: 0.7, y: 0.66 }),
  Object.freeze({ x: 0.38, y: 0.36 }),
  Object.freeze({ x: 0.62, y: 0.36 }),
]);
const PALETTES = Object.freeze({
  flower: Object.freeze([
    ["#ff5f91", "#ffe86b", "#318a56"],
    ["#8c6fe8", "#fff0a6", "#397ec2"],
    ["#ff8a3d", "#fff8c7", "#318a56"],
    ["#ef4fcb", "#ffe86b", "#227c69"],
    ["#4d9ceb", "#fff4bd", "#4c8b42"],
  ]),
  friend: Object.freeze([
    ["#ed6f71", "#f2b58d", "#603a32"],
    ["#4f96dc", "#9c694e", "#2e211f"],
    ["#8f72d8", "#f0c49d", "#bb6b39"],
    ["#39a776", "#754733", "#241f23"],
    ["#f29b38", "#d99670", "#70462f"],
  ]),
  cloud: Object.freeze([
    ["#f9fdff", "#d7eff7", "#6b8a9b"],
    ["#e5f2ff", "#bedcf0", "#587b98"],
    ["#fff7e2", "#f0dcae", "#8d7963"],
    ["#e9e5fb", "#ccc2ec", "#6f6790"],
    ["#ddf7ed", "#b9e7d6", "#547d70"],
  ]),
  sun: Object.freeze([
    ["#ffd34e", "#ff9f32", "#8b5a20"],
    ["#ffb93e", "#ff7b42", "#8a4528"],
    ["#fff06a", "#f4b431", "#79601d"],
    ["#ffcf70", "#ef8752", "#81503a"],
    ["#f9e45d", "#dfa92a", "#756022"],
  ]),
  child: Object.freeze([["#ed6f71","#f2b58d","#603a32"],["#4f96dc","#9c694e","#2e211f"],["#8f72d8","#f0c49d","#bb6b39"],["#39a776","#754733","#241f23"],["#f29b38","#d99670","#70462f"]]),
  car: Object.freeze([["#ef5d6c","#a9e7f5","#47224f"],["#4f96dc","#fff4cf","#29385f"],["#ffd85c","#a9e7f5","#70462f"],["#39a776","#fff4cf","#254b42"],["#8f72d8","#d8f2ff","#493a73"]]),
  bus: Object.freeze([["#ffd85c","#a9e7f5","#47224f"],["#ef5d6c","#fff4cf","#603a32"],["#4f96dc","#d8f2ff","#29385f"],["#39a776","#fff4cf","#254b42"],["#8f72d8","#e9e5fb","#493a73"]]),
  home: Object.freeze([["#ef5d6c","#fff4cf","#603a32"],["#4f96dc","#ffd85c","#29385f"],["#39a776","#fff4cf","#254b42"],["#8f72d8","#f0c49d","#493a73"],["#f29b38","#d8f2ff","#70462f"]]),
  dragon: Object.freeze([["#8f72d8","#ffd85c","#493a73"],["#ef5d6c","#fff4cf","#603a32"],["#7b55e7","#ff9b62","#3d2a73"],["#4f96dc","#d8f2ff","#29385f"],["#f29b38","#fff4cf","#70462f"]]),
  person: Object.freeze([["#ed6f71","#f2b58d","#603a32"],["#4f96dc","#9c694e","#2e211f"],["#8f72d8","#f0c49d","#bb6b39"],["#39a776","#754733","#241f23"],["#f29b38","#d99670","#70462f"]]),
  horse: Object.freeze([["#a86d43","#f1c08f","#493224"],["#ece1cf","#fff8e8","#635a52"],["#6f4a38","#d89b66","#2f241f"],["#d4975c","#ffe0ad","#70462f"],["#8b78a7","#d9caed","#493a73"]]),
  armor: Object.freeze([["#7d91a8","#d8f2ff","#29385f"],["#4f96dc","#ffd85c","#29385f"],["#ef5d6c","#fff4cf","#603a32"],["#8f72d8","#e9e5fb","#493a73"],["#39a776","#fff4cf","#254b42"]]),
});

const STORY_STORAGE_KEY = "supersimplegames.story.creation";
let state = createSceneState();
let parkedScenes = {};
try {
  const saved = loadLocalState(STORY_STORAGE_KEY);
  if (saved) {
    const world = restoreStoryWorld(saved);
    state = world.scenes[world.active];
    for (const [id, scene] of Object.entries(world.scenes)) {
      if (id !== world.active) parkedScenes[id] = scene;
    }
  }
} catch {
  clearLocalState(STORY_STORAGE_KEY);
}
let soundEnabled = loadSoundPreference();
let drag = null;
let suppressClickFor = null;
const tonePlayer = createTonePlayer({ initialEnabled: soundEnabled });

function persistStoryWorld() {
  saveLocalState(STORY_STORAGE_KEY, serializeStoryWorld(state.sceneId, {
    [state.sceneId]: state,
    ...parkedScenes,
  }));
}

function renderSoundState() {
  soundToggle.setAttribute("aria-pressed", String(soundEnabled));
  soundToggle.setAttribute("aria-label", soundEnabled ? "Turn sound off" : "Turn sound on");
}

function applyPalette(element, object) {
  const colors = PALETTES[object.kind][object.variant];
  element.style.setProperty("--object-main", colors[0]);
  element.style.setProperty("--object-detail", colors[1]);
  element.style.setProperty("--object-dark", colors[2]);
}

function currentPack() { return getStoryPack(state.sceneId); }
function currentItem(kind) { return storyCastItem(currentPack(), kind); }

function updateStageLabel() {
  stage.setAttribute("aria-label", `${currentPack().label} story scene. Tap empty space or press Enter to add the highlighted kind.`);
}

const DRAGON_SVG = `
<svg class="dragon-figure" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
  <path d="M92 40 Q99 52 87 59" fill="none" stroke="var(--object-dark)" stroke-width="13" stroke-linecap="round"/>
  <path d="M92 40 Q99 52 87 59" fill="none" stroke="var(--object-main)" stroke-width="7.5" stroke-linecap="round"/>
  <path d="M84 56 C70 67 46 67 33 57 C23 49 21 37 26 29" fill="none" stroke="var(--object-dark)" stroke-width="18" stroke-linecap="round"/>
  <path d="M84 56 C70 67 46 67 33 57 C23 49 21 37 26 29" fill="none" stroke="var(--object-main)" stroke-width="12" stroke-linecap="round"/>
  <path d="M52 54 L61 31 L65 49 L75 32 L77 55 Z" fill="var(--object-detail)" stroke="var(--object-dark)" stroke-width="2.6"/>
  <circle cx="30" cy="26" r="11" fill="var(--object-main)" stroke="var(--object-dark)" stroke-width="3.6"/>
  <rect x="9" y="21" width="17" height="11" rx="5.5" fill="var(--object-detail)" stroke="var(--object-dark)" stroke-width="3"/>
  <path d="M35 13 L39 3 L43 14 Z" fill="var(--object-detail)" stroke="var(--object-dark)" stroke-width="2.2"/>
  <circle cx="28" cy="22.5" r="2.7" fill="#fff"/>
  <circle cx="28.8" cy="22.9" r="1.35" fill="var(--object-dark)"/>
  <path d="M31 71 Q49 77 69 72" fill="none" stroke="var(--object-detail)" stroke-width="3" stroke-linecap="round"/>
</svg>`;

function createObjectElement(object, motionId, motion) {
  const button = document.createElement("button");
  const art = document.createElement("span");
  const main = document.createElement("i");
  const detail = document.createElement("b");
  button.type = "button";
  button.className = `scene-object ${object.kind}-object`;
  if (object.id !== motionId || !motion) button.classList.add("steady");
  else if (motion === "changed") button.classList.add("changed");
  button.dataset.id = object.id;
  button.dataset.kind = object.kind;
  button.style.setProperty("--x", object.x);
  button.style.setProperty("--y", object.y);
  button.style.zIndex = String(20 + Math.round(object.y * 50));
  button.setAttribute("aria-label", `${currentItem(object.kind).label}, version ${object.variant + 1}; tap to change or move`);
  art.className = `scene-art ${object.kind}-art`;
  art.setAttribute("aria-hidden", "true");
  if (object.kind === "dragon") {
    art.innerHTML = DRAGON_SVG;
  } else {
    art.append(main, detail);
  }
  button.append(art);
  applyPalette(button, object);
  return button;
}

function objectFor(id) {
  return state.objects.find((object) => object.id === id);
}

function currentLayout() {
  const bounds = stage.getBoundingClientRect();
  return { width: bounds.width, height: bounds.height };
}

function markRelated(relationship) {
  const first = objectLayer.querySelector(`[data-id="${relationship.first}"]`);
  const second = objectLayer.querySelector(`[data-id="${relationship.second}"]`);
  if (!first || !second) return;
  first.classList.add(`related-${relationship.type}`);
  second.classList.add(`related-${relationship.type}`);

  const firstObject = objectFor(relationship.first);
  const secondObject = objectFor(relationship.second);
  const decoration = document.createElement("span");
  decoration.className = `scene-relation relation-${relationship.type} interaction-${relationship.phase}`;
  decoration.dataset.phase = relationship.phase;
  decoration.style.setProperty("--relation-x", (firstObject.x + secondObject.x) / 2);
  decoration.style.setProperty("--relation-y", (firstObject.y + secondObject.y) / 2);
  relationLayer.append(decoration);
}

function markComposition(composition) {
  for (const id of composition.participants) {
    objectLayer.querySelector(`[data-id="${id}"]`)?.classList.add("combination-part");
  }
  const discovery = document.createElement("span");
  discovery.className = `scene-combination combination-${composition.type}`;
  discovery.style.setProperty("--relation-x", composition.x);
  discovery.style.setProperty("--relation-y", composition.y);
  discovery.setAttribute("aria-hidden", "true");
  discovery.append(document.createElement("i"), document.createElement("b"));
  relationLayer.append(discovery);
}

function renderScene(focusId, motion) {
  objectLayer.replaceChildren(...state.objects.map((object) => createObjectElement(object, focusId, motion)));
  relationLayer.replaceChildren();
  const relationships = relationshipsForScene(state, currentLayout());
  const visiblePhase = new Map();
  for (const relationship of relationships) {
    if (!visiblePhase.has(relationship.first)) visiblePhase.set(relationship.first, relationship.phase);
    if (!visiblePhase.has(relationship.second)) visiblePhase.set(relationship.second, relationship.phase);
    markRelated(relationship);
  }
  for (const composition of compositionsForScene(state, currentLayout())) markComposition(composition);
  for (const [id, phase] of visiblePhase) objectLayer.querySelector(`[data-id="${id}"]`)?.classList.add(`interaction-${phase}`);
  if (focusId) objectLayer.querySelector(`[data-id="${focusId}"]`)?.focus({ preventScroll: true });
}

function renderPalette() {
  palette.replaceChildren(...currentPack().cast.map((item) => {
    const tool = document.createElement("button");
    tool.type = "button";
    tool.className = "story-tool";
    tool.dataset.kind = item.kind;
    tool.setAttribute("aria-pressed", String(item.kind === state.selected));
    tool.setAttribute("aria-label", `Choose ${item.plural.toLowerCase()}`);
    const art = document.createElement("span");
    art.className = `mini-art ${item.kind}-art`;
    art.setAttribute("aria-hidden", "true");
    if (item.kind === "dragon") {
      art.innerHTML = DRAGON_SVG;
    } else {
      art.append(document.createElement("i"), document.createElement("b"));
    }
    const label = document.createElement("span");
    label.textContent = item.plural;
    tool.append(art, label);
    return tool;
  }));
}

function normalizedPoint(event) {
  const bounds = stage.getBoundingClientRect();
  return {
    x: (event.clientX - bounds.left) / bounds.width,
    y: (event.clientY - bounds.top) / bounds.height,
  };
}

function relationMessage(relationships) {
  return relationships[0]?.message || null;
}

function applyResult(result) {
  state = result.state;
  const compositions = compositionsForScene(state, currentLayout())
    .filter(({ participants }) => participants.includes(result.object.id));
  if (result.action !== "moved") state = selectNextSceneKind(state);
  renderScene(result.object.id, result.action === "placed" ? "arrived" : result.action === "changed" ? "changed" : null);
  renderPalette();
  const related = relationMessage(result.relationships);
  const action = result.action === "placed" ? "joined the story" : result.action === "moved" ? "moved" : "changed";
  const text = compositions.at(-1)?.message || related || `The ${currentItem(result.object.kind).label} ${action}!`;
  message.textContent = text;
  announcement.textContent = text;
  tonePlayer.play(currentItem(result.object.kind).tone * (related ? 1.18 : 1));
  persistStoryWorld();
}

function freshStory() {
  state = createSceneState(state.sceneId);
  persistStoryWorld();
  renderPalette();
  renderScene();
  message.textContent = `Tap the ${currentPack().label.toLowerCase()} to add ${currentItem(state.selected).plural.toLowerCase()}!`;
  announcement.textContent = "A fresh story is ready";
}

palette.addEventListener("click", (event) => {
  const tool = event.target.closest(".story-tool");
  if (!tool) return;
  state = selectSceneKind(state, tool.dataset.kind);
  renderPalette();
  const plural = tool.querySelector("span:last-child").textContent.toLowerCase();
  message.textContent = `Tap the ${currentPack().label.toLowerCase()} to add ${plural}!`;
  announcement.textContent = `${plural} selected`;
  tonePlayer.play(currentItem(tool.dataset.kind).tone);
  persistStoryWorld();
});

function closeBackgroundPicker() {
  backgroundPicker.hidden = true;
  backgroundButton.setAttribute("aria-expanded", "false");
}

function renderBackgroundOptions() {
  backgroundOptions.replaceChildren(...STORY_PACKS.map((pack) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.sceneId = pack.id;
    button.textContent = pack.label;
    if (pack.id === state.sceneId) button.disabled = true;
    return button;
  }));
}

backgroundButton.addEventListener("click", () => {
  backgroundPicker.hidden = false;
  backgroundButton.setAttribute("aria-expanded", "true");
  renderBackgroundOptions();
});
backgroundOptions.addEventListener("click", (event) => {
  const option = event.target.closest("[data-scene-id]");
  if (!option || option.disabled) return;
  const targetId = option.dataset.sceneId;
  const returning = Boolean(parkedScenes[targetId]);
  parkedScenes[state.sceneId] = state;
  state = parkedScenes[targetId] ?? createSceneState(targetId);
  delete parkedScenes[targetId];
  stage.dataset.scene = state.sceneId;
  backgroundButton.textContent = currentPack().label;
  updateStageLabel();
  renderPalette();
  renderScene();
  message.textContent = `Tap the ${currentPack().label.toLowerCase()} to add ${currentItem(state.selected).plural.toLowerCase()}!`;
  announcement.textContent = returning ? `Back in ${currentPack().label}. Your story waited here.` : `Welcome to ${currentPack().label}!`;
  persistStoryWorld();
  closeBackgroundPicker();
});
backgroundCancel.addEventListener("click", closeBackgroundPicker);

objectLayer.addEventListener("pointerdown", (event) => {
  const object = event.target.closest(".scene-object");
  if (!object) return;
  event.preventDefault();
  object.setPointerCapture?.(event.pointerId);
  drag = {
    id: object.dataset.id,
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    moved: false,
  };
});

objectLayer.addEventListener("pointermove", (event) => {
  if (!drag || event.pointerId !== drag.pointerId) return;
  const object = objectLayer.querySelector(`[data-id="${drag.id}"]`);
  if (!object) return;
  const distance = Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY);
  if (!drag.moved && distance < 9) return;
  drag.moved = true;
  object.classList.add("dragging");
  const point = normalizedPoint(event);
  object.style.setProperty("--x", Math.min(Math.max(point.x, 0.08), 0.92));
  object.style.setProperty("--y", Math.min(Math.max(point.y, 0.16), 0.88));
});

function endDrag(event) {
  if (!drag || event.pointerId !== drag.pointerId) return;
  const current = drag;
  drag = null;
  if (event.type === "pointercancel") {
    renderScene(current.id);
    return;
  }
  if (!current.moved) return;
  suppressClickFor = current.id;
  setTimeout(() => {
    if (suppressClickFor === current.id) suppressClickFor = null;
  }, 0);
  applyResult(moveSceneObject(state, current.id, normalizedPoint(event), currentLayout()));
}

for (const eventName of ["pointerup", "pointercancel", "lostpointercapture"]) {
  objectLayer.addEventListener(eventName, endDrag);
}

objectLayer.addEventListener("click", (event) => {
  const object = event.target.closest(".scene-object");
  if (!object) return;
  event.stopPropagation();
  if (suppressClickFor === object.dataset.id) {
    suppressClickFor = null;
    return;
  }
  applyResult(touchSceneObject(state, object.dataset.id, currentLayout()));
});

stage.addEventListener("click", (event) => {
  if (!backgroundPicker.hidden) return;
  if (event.target.closest(".scene-object")) return;
  applyResult(placeSceneObject(state, normalizedPoint(event), currentLayout()));
});

stage.addEventListener("keydown", (event) => {
  if (!backgroundPicker.hidden || event.target !== stage || !["Enter", " "].includes(event.key)) return;
  event.preventDefault();
  applyResult(placeSceneObject(state, KEYBOARD_POINTS[state.objects.length % KEYBOARD_POINTS.length], currentLayout()));
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
addEventListener("pagehide", () => persistStoryWorld());

stage.dataset.scene = state.sceneId;
backgroundButton.textContent = currentPack().label;
updateStageLabel();
renderPalette();
renderSoundState();
renderScene();
setupFreshStart({ onConfirm: freshStory });

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  const workerUrl = new URL("../sw.js", import.meta.url);
  addEventListener("load", () => navigator.serviceWorker.register(workerUrl));
}
