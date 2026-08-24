import { createTonePlayer } from "./audio.js";
import { choicesForLevel, createSpawnPlan, toneFor } from "./nibbles-core.js";
import { loadCaregiverSettings } from "./caregiver-settings.js";
import { getPocketItem } from "./pocket-items.js";
import { protectPlaySurface } from "./play-gesture.js";
import { loadSoundPreference, saveSoundPreference } from "./settings.js";
import { startWindDown } from "./wind-down.js";

const KIND_POOL = Object.freeze(["duck", "cat", "bear", "flower", "star", "sun"]);
const COUNT_WORDS = Object.freeze({ 1: "one", 2: "two", 3: "three", 4: "four", 5: "five" });
const PLURALS = Object.freeze({
  duck: "ducks", cat: "cats", bear: "bears", flower: "flowers", star: "stars", sun: "suns"
});
const ARRIVAL_STEP_MS = 300;

const scene = document.querySelector("#spawn-scene");
const bubbles = document.querySelector("#number-bubbles");
const ghost = document.querySelector("#ghost-number");
const message = document.querySelector("#nibbles-message");
const announcement = document.querySelector("#announcement");
const soundToggle = document.querySelector("#sound-toggle");

let soundEnabled = loadSoundPreference();
const tonePlayer = createTonePlayer({ initialEnabled: soundEnabled });
const choices = choicesForLevel(loadCaregiverSettings().level);
let timers = [];

function renderSoundState() {
  soundToggle.setAttribute("aria-pressed", String(soundEnabled));
  soundToggle.setAttribute("aria-label", soundEnabled ? "Turn sound off" : "Turn sound on");
}

function nextSeed() {
  try {
    const value = new Uint32Array(1);
    crypto.getRandomValues(value);
    return value[0];
  } catch {
    return Date.now() >>> 0;
  }
}

function say(text) {
  announcement.textContent = text;
}

function replayClass(element, className, duration) {
  element.classList.remove(className);
  void element.offsetWidth;
  element.classList.add(className);
  if (duration) setTimeout(() => element.classList.remove(className), duration);
}

function clearTimers() {
  for (const timer of timers) clearTimeout(timer);
  timers = [];
}

function renderBubbles() {
  bubbles.replaceChildren(...choices.map((choice) => {
    const bubble = document.createElement("button");
    bubble.type = "button";
    bubble.className = "number-bubble";
    bubble.dataset.count = String(choice);
    bubble.textContent = String(choice);
    bubble.setAttribute("aria-label", `Make ${COUNT_WORDS[choice]} friend${choice > 1 ? "s" : ""} appear`);
    return bubble;
  }));
}

function makeFriend(planEntry, kind) {
  const item = getPocketItem(kind);
  const friend = document.createElement("button");
  friend.type = "button";
  friend.className = "scene-friend arriving";
  friend.dataset.order = String(planEntry.order);
  friend.style.setProperty("--x", `${Math.round(planEntry.x * 100)}%`);
  friend.style.setProperty("--y", `${Math.round(planEntry.y * 100)}%`);
  friend.setAttribute("aria-label", `A ${item.name}; touch it to say hello`);
  const art = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  art.setAttribute("viewBox", "0 0 100 100");
  art.setAttribute("aria-hidden", "true");
  const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
  use.setAttribute("href", `../../assets/pocket-friends.svg#${item.artId}`);
  art.append(use);
  friend.append(art);
  friend.addEventListener("click", () => {
    replayClass(friend, "hopping", 520);
    tonePlayer.play(toneFor(Number(friend.dataset.order)));
    say(`${item.name}!`);
    message.textContent = item.name;
  });
  return friend;
}

function spawnGroup(count) {
  clearTimers();
  // Existing friends wave goodbye before the new group bursts in.
  for (const existing of [...scene.querySelectorAll(".scene-friend")]) {
    existing.classList.add("leaving");
    setTimeout(() => existing.remove(), 460);
  }

  const seed = nextSeed();
  const kindSeed = nextSeed();
  const kind = KIND_POOL[kindSeed % KIND_POOL.length];
  const plan = createSpawnPlan({ count, seed });
  const word = COUNT_WORDS[count];
  const plural = PLURALS[kind];

  ghost.textContent = String(count);
  replayClass(ghost, "flashing", 950);
  message.textContent = `${word} ${plural}!`;
  say(`${word} ${plural}.`);

  for (const entry of plan) {
    timers.push(setTimeout(() => {
      scene.append(makeFriend(entry, kind));
      tonePlayer.play(toneFor(entry.order));
    }, entry.order * ARRIVAL_STEP_MS + 120));
  }
}

bubbles.addEventListener("click", (event) => {
  const bubble = event.target.closest(".number-bubble");
  if (!bubble) return;
  replayClass(bubble, "pulsing", 480);
  spawnGroup(Number(bubble.dataset.count));
});

soundToggle.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  tonePlayer.setEnabled(soundEnabled);
  saveSoundPreference(soundEnabled);
  renderSoundState();
  if (soundEnabled) tonePlayer.play(392);
});

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") void tonePlayer.suspend();
});
addEventListener("pagehide", tonePlayer.stop);

renderBubbles();
renderSoundState();
protectPlaySurface();
startWindDown({ lines: { "/games/number-nibbles/": "The numbers are resting." } });

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  const workerUrl = new URL("../sw.js", import.meta.url);
  addEventListener("load", () => navigator.serviceWorker.register(workerUrl));
}
