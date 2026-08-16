import { createTonePlayer } from "./audio.js";
import { activateVoice, createToneState } from "./together-tone.js";
import { loadSoundPreference, saveSoundPreference } from "./settings.js";

const board = document.querySelector("#tone-board");
const stage = document.querySelector("#tones-stage");
const trail = document.querySelector("#tone-trail");
const link = document.querySelector("#harmony-link");
const message = document.querySelector("#tone-message");
const announcement = document.querySelector("#announcement");
const soundToggle = document.querySelector("#sound-toggle");

const VOICES = Object.freeze({
  berry: Object.freeze({ label: "Berry", frequency: 293.66 }),
  sunny: Object.freeze({ label: "Sunny", frequency: 392 }),
  sky: Object.freeze({ label: "Sky", frequency: 493.88 }),
  leaf: Object.freeze({ label: "Leaf", frequency: 587.33 }),
});

let state = createToneState();
let soundEnabled = loadSoundPreference();
const tonePlayer = createTonePlayer({ initialEnabled: soundEnabled });

function renderSoundState() {
  soundToggle.setAttribute("aria-pressed", String(soundEnabled));
  soundToggle.setAttribute("aria-label", soundEnabled ? "Turn sound off" : "Turn sound on");
}

function renderTrail() {
  const dots = state.trail.map((id) => {
    const dot = document.createElement("span");
    dot.className = `trail-dot ${id}-dot`;
    dot.setAttribute("aria-hidden", "true");
    return dot;
  });
  trail.replaceChildren(...dots);
  trail.setAttribute("aria-label", state.trail.length
    ? `Recent tones: ${state.trail.map((id) => VOICES[id].label).join(", ")}`
    : "No recent tones");
}

function renderLink() {
  if (!state.pair) {
    link.hidden = true;
    return;
  }
  const first = board.querySelector(`[data-id="${state.pair[0]}"]`).getBoundingClientRect();
  const second = board.querySelector(`[data-id="${state.pair[1]}"]`).getBoundingClientRect();
  const bounds = stage.getBoundingClientRect();
  const firstPoint = { x: first.left + first.width / 2 - bounds.left, y: first.top + first.height / 2 - bounds.top };
  const secondPoint = { x: second.left + second.width / 2 - bounds.left, y: second.top + second.height / 2 - bounds.top };
  link.hidden = false;
  link.style.left = `${firstPoint.x}px`;
  link.style.top = `${firstPoint.y}px`;
  link.style.width = `${Math.hypot(secondPoint.x - firstPoint.x, secondPoint.y - firstPoint.y)}px`;
  link.style.transform = `rotate(${Math.atan2(secondPoint.y - firstPoint.y, secondPoint.x - firstPoint.x)}rad)`;
  link.dataset.from = state.pair[0];
  link.dataset.to = state.pair[1];
  link.classList.remove("fresh");
  void link.offsetWidth;
  link.classList.add("fresh");
}

function animatePad(id, mode) {
  for (const pad of board.querySelectorAll(".voice-pad")) pad.classList.remove("active", "echo", "together");
  const pad = board.querySelector(`[data-id="${id}"]`);
  pad.style.setProperty("--voice-level", state.levels[id]);
  void pad.offsetWidth;
  pad.classList.add("active", mode);
  if (mode === "together" && state.pair) {
    board.querySelector(`[data-id="${state.pair[0]}"]`)?.classList.add("together");
  }
}

function applyVoice(id) {
  const result = activateVoice(state, id);
  state = result.state;
  renderTrail();
  renderLink();
  animatePad(id, result.mode);
  const label = VOICES[id].label;
  const text = result.mode === "hello"
    ? `${label} says hello!`
    : result.mode === "echo"
      ? `${label} echoes!`
      : `${VOICES[result.previous].label} and ${label}, together!`;
  message.textContent = text;
  announcement.textContent = text;
  tonePlayer.play(VOICES[id].frequency * (1 + (result.level * 0.035)));
}

board.addEventListener("click", (event) => {
  const pad = event.target.closest(".voice-pad");
  if (pad) applyVoice(pad.dataset.id);
});

soundToggle.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  tonePlayer.setEnabled(soundEnabled);
  saveSoundPreference(soundEnabled);
  renderSoundState();
  if (soundEnabled) tonePlayer.play(440);
});

addEventListener("resize", renderLink);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") void tonePlayer.suspend();
});
addEventListener("pagehide", tonePlayer.stop);

renderSoundState();
renderTrail();
renderLink();

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  const workerUrl = new URL("../sw.js", import.meta.url);
  addEventListener("load", () => navigator.serviceWorker.register(workerUrl));
}
