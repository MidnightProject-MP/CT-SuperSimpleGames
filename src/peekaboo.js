import { createTonePlayer } from "./audio.js";
import { getPocketItem } from "./pocket-items.js";
import { createRound, togglePocket } from "./pockets.js";
import { loadSoundPreference, saveSoundPreference } from "./settings.js";

const pocketRow = document.querySelector("#pocket-row");
const message = document.querySelector("#peek-message");
const announcement = document.querySelector("#announcement");
const soundToggle = document.querySelector("#sound-toggle");

let round = createRound({ seed: nextSeed() });
let soundEnabled = loadSoundPreference();
const tonePlayer = createTonePlayer({ initialEnabled: soundEnabled });

function nextSeed() {
  try {
    const value = new Uint32Array(1);
    crypto.getRandomValues(value);
    return value[0];
  } catch {
    return Date.now() >>> 0;
  }
}

function renderSoundState() {
  soundToggle.setAttribute("aria-pressed", String(soundEnabled));
  soundToggle.setAttribute("aria-label", soundEnabled ? "Turn sound off" : "Turn sound on");
}

function createPockets() {
  const fragment = document.createDocumentFragment();
  for (let index = 0; index < round.itemIds.length; index += 1) {
    const pocket = document.createElement("button");
    const friend = document.createElement("span");
    const body = document.createElement("span");
    const flap = document.createElement("span");
    pocket.className = "pocket";
    pocket.type = "button";
    pocket.dataset.index = String(index);
    friend.className = "pocket-friend";
    friend.setAttribute("aria-hidden", "true");
    body.className = "pocket-body";
    body.setAttribute("aria-hidden", "true");
    flap.className = "pocket-flap";
    flap.setAttribute("aria-hidden", "true");
    pocket.append(friend, body, flap);
    fragment.append(pocket);
  }
  pocketRow.replaceChildren(fragment);
  renderPockets();
}

function renderPockets() {
  for (const pocket of pocketRow.querySelectorAll(".pocket")) {
    const index = Number(pocket.dataset.index);
    const item = getPocketItem(round.itemIds[index]);
    const isOpen = round.open[index];
    pocket.dataset.pattern = round.patternIds[index];
    pocket.setAttribute("aria-expanded", String(isOpen));
    pocket.setAttribute("aria-label", isOpen
      ? `Pocket ${index + 1}, open, ${item.name} inside`
      : `Pocket ${index + 1}, closed`);
    pocket.querySelector(".pocket-friend").textContent = item.symbol;
  }
}

function animatePocket(pocket, opening) {
  pocket.classList.remove("just-opened", "just-closed");
  void pocket.offsetWidth;
  pocket.classList.add(opening ? "just-opened" : "just-closed");
}

function toggle(index) {
  const result = togglePocket(round, index);
  round = result.state;
  const pocket = pocketRow.querySelector(`[data-index="${index}"]`);
  const item = getPocketItem(result.itemId);
  renderPockets();
  animatePocket(pocket, result.open);
  const tone = result.completedNow ? item.tone * 1.25 : result.open ? item.tone : item.tone * 0.78;
  tonePlayer.play(tone);

  if (result.completedNow) {
    message.textContent = "All found!";
    message.classList.add("complete");
    announcement.textContent = `All three found. ${item.name} is in pocket ${index + 1}.`;
    return;
  }

  message.classList.remove("complete");
  message.textContent = result.open ? `${item.symbol} ${item.name}!` : "Peekaboo!";
  announcement.textContent = result.open
    ? `${item.name} in pocket ${index + 1}`
    : `Pocket ${index + 1} closed`;
}

function nearestPocket(clientX, clientY) {
  let nearest;
  let nearestDistance = Number.POSITIVE_INFINITY;
  for (const pocket of pocketRow.querySelectorAll(".pocket")) {
    const bounds = pocket.getBoundingClientRect();
    const dx = clientX - (bounds.left + bounds.width / 2);
    const dy = clientY - (bounds.top + bounds.height / 2);
    const distance = dx * dx + dy * dy;
    if (distance >= nearestDistance) continue;
    nearest = pocket;
    nearestDistance = distance;
  }
  return nearest;
}

pocketRow.addEventListener("click", (event) => {
  const pocket = event.target.closest(".pocket") || nearestPocket(event.clientX, event.clientY);
  if (!pocket) return;
  toggle(Number(pocket.dataset.index));
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

createPockets();
renderSoundState();

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  const workerUrl = new URL("../sw.js", import.meta.url);
  addEventListener("load", () => navigator.serviceWorker.register(workerUrl));
}
