import { createTonePlayer } from "./audio.js";
import { loadSoundPreference, saveSoundPreference } from "./settings.js";
import { protectPlaySurface } from "./play-gesture.js";
import { addItem, createNibblesState, NIBBLES_CAP, removeItem, toneFor } from "./nibbles-core.js";
import { startWindDown } from "./wind-down.js";

const COUNT_WORDS = Object.freeze({ 1: "one", 2: "two", 3: "three", 4: "four", 5: "five" });

const tray = document.querySelector("#nibble-tray");
const creature = document.querySelector("#creature");
const pile = document.querySelector("#creature-pile");
const message = document.querySelector("#nibbles-message");
const announcement = document.querySelector("#announcement");
const soundToggle = document.querySelector("#sound-toggle");

let state = createNibblesState();
let soundEnabled = loadSoundPreference();
const tonePlayer = createTonePlayer({ initialEnabled: soundEnabled });
let items = [];

function renderSoundState() {
  soundToggle.setAttribute("aria-pressed", String(soundEnabled));
  soundToggle.setAttribute("aria-label", soundEnabled ? "Turn sound off" : "Turn sound on");
}

function replayClass(element, className, duration) {
  element.classList.remove(className);
  void element.offsetWidth;
  element.classList.add(className);
  setTimeout(() => element.classList.remove(className), duration);
}

function say(text) {
  announcement.textContent = text;
}

function renderPile() {
  pile.replaceChildren(...items.map((item, index) => {
    const dot = document.createElement("span");
    dot.className = "pile-item";
    dot.style.setProperty("--i", String(index));
    return dot;
  }));
}

function reactionFor(count) {
  if (count >= 3) return "delighted";
  if (count === 2) return "happy";
  return "curious";
}

function renderCreature() {
  creature.dataset.mood = reactionFor(state.count);
}

function spawnItem() {
  const item = document.createElement("span");
  item.className = "nibble arriving";
  tray.append(item);
  items.push(item);
  return item;
}

function releaseItem() {
  const item = items.pop();
  if (!item) return;
  item.classList.remove("arriving");
  item.classList.add("leaving");
  setTimeout(() => item.remove(), 620);
}

tray.addEventListener("click", () => {
  const next = addItem(state);
  if (!next) {
    // The creature is satisfyingly full — celebrate rather than refuse.
    replayClass(creature, "full-bounce", 620);
    message.textContent = "So many! Yum.";
    say("The friend is full.");
    tonePlayer.play(toneFor(NIBBLES_CAP) * 1.12);
    return;
  }
  state = next;
  spawnItem();
  renderPile();
  renderCreature();
  const word = COUNT_WORDS[state.count];
  message.textContent = `${word} ${state.count === 1 ? "berry" : "berries"}!`;
  say(`${word}.`);
  tonePlayer.play(toneFor(state.count));
  replayClass(creature, `mood-${reactionFor(state.count)}`, 560);
});

creature.addEventListener("click", () => {
  const next = removeItem(state);
  if (!next) {
    replayClass(tray, "empty-wiggle", 420);
    message.textContent = "All gone!";
    say("The plate is empty.");
    return;
  }
  state = next;
  releaseItem();
  renderPile();
  renderCreature();
  if (state.count === 0) {
    message.textContent = "Munch! All gone!";
    say("All gone.");
  } else {
    const word = COUNT_WORDS[state.count];
    message.textContent = `${word} ${state.count === 1 ? "berry" : "berries"} left`;
    say(word);
  }
  tonePlayer.play(toneFor(state.count) * 0.94);
  replayClass(creature, "munching", 520);
});

soundToggle.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  tonePlayer.setEnabled(soundEnabled);
  saveSoundPreference(soundEnabled);
  renderSoundState();
  if (soundEnabled) tonePlayer.play(330);
});

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") void tonePlayer.suspend();
});
addEventListener("pagehide", tonePlayer.stop);

renderPile();
renderCreature();
renderSoundState();
protectPlaySurface();
startWindDown({ lines: { "/games/number-nibbles/": "The friend is full and sleepy." } });

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  const workerUrl = new URL("../sw.js", import.meta.url);
  addEventListener("load", () => navigator.serviceWorker.register(workerUrl));
}
