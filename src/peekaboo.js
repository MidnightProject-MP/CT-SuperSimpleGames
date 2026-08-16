import { createTonePlayer } from "./audio.js";
import { getPocketItem } from "./pocket-items.js";
import { createRound, greetingPair, togglePocket } from "./pockets.js";
import { loadSoundPreference, saveSoundPreference } from "./settings.js";

const pocketRow = document.querySelector("#pocket-row");
const playfield = document.querySelector("#peek-playfield");
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
    const station = document.createElement("div");
    const pocket = document.createElement("button");
    const friend = document.createElement("button");
    const friendArt = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const friendUse = document.createElementNS("http://www.w3.org/2000/svg", "use");
    const body = document.createElement("span");
    const flap = document.createElement("span");
    station.className = "pocket-station";
    station.dataset.index = String(index);
    pocket.className = "pocket";
    pocket.type = "button";
    pocket.dataset.index = String(index);
    friend.type = "button";
    friend.className = "pocket-friend";
    friend.dataset.index = String(index);
    friendArt.setAttribute("viewBox", "0 0 100 100");
    friendArt.setAttribute("aria-hidden", "true");
    friendArt.append(friendUse);
    friend.append(friendArt);
    body.className = "pocket-body";
    body.setAttribute("aria-hidden", "true");
    flap.className = "pocket-flap";
    flap.setAttribute("aria-hidden", "true");
    pocket.append(body, flap);
    station.append(friend, pocket);
    fragment.append(station);
  }
  pocketRow.replaceChildren(fragment);
  renderPockets();
}

function renderPockets() {
  for (const station of pocketRow.querySelectorAll(".pocket-station")) {
    const index = Number(station.dataset.index);
    const pocket = station.querySelector(".pocket");
    const friend = station.querySelector(".pocket-friend");
    const item = getPocketItem(round.itemIds[index]);
    const isOpen = round.open[index];
    station.classList.toggle("open", isOpen);
    pocket.dataset.pattern = round.patternIds[index];
    pocket.setAttribute("aria-expanded", String(isOpen));
    pocket.setAttribute("aria-label", isOpen
      ? `Pocket ${index + 1}, open, ${item.name} inside`
      : `Pocket ${index + 1}, closed`);
    friend.tabIndex = isOpen ? 0 : -1;
    friend.setAttribute("aria-hidden", String(!isOpen));
    friend.setAttribute("aria-label", `Say hello to ${item.name}`);
    friend.querySelector("use").setAttribute("href", `../../assets/pocket-friends.svg#${item.artId}`);
  }
}

function animatePocket(pocket, opening) {
  const friend = pocket.closest(".pocket-station").querySelector(".pocket-friend");
  pocket.classList.remove("just-opened", "just-closed");
  friend.classList.remove("just-emerged");
  void pocket.offsetWidth;
  pocket.classList.add(opening ? "just-opened" : "just-closed");
  if (opening) friend.classList.add("just-emerged");
}

function animateFriend(index, className = "saying-hello") {
  const friend = pocketRow.querySelector(`.pocket-friend[data-index="${index}"]`);
  friend.classList.remove("saying-hello", "greeting-left", "greeting-right");
  void friend.offsetWidth;
  friend.classList.add(className);
}

function animateGreeting(pair) {
  const [firstIndex, secondIndex] = pair;
  const leftIndex = Math.min(firstIndex, secondIndex);
  const rightIndex = Math.max(firstIndex, secondIndex);
  animateFriend(leftIndex, "greeting-right");
  animateFriend(rightIndex, "greeting-left");
}

function playFriend(index) {
  if (!round.open[index]) return;
  const item = getPocketItem(round.itemIds[index]);
  const pair = greetingPair(round, index);
  tonePlayer.play(item.tone * 1.08);
  if (pair) {
    animateGreeting(pair);
    const partnerIndex = pair.find((value) => value !== index);
    const partner = getPocketItem(round.itemIds[partnerIndex]);
    message.textContent = `${item.name} and ${partner.name} say hello!`;
    announcement.textContent = `${item.name} and ${partner.name} greet each other`;
    return;
  }
  animateFriend(index);
  message.textContent = `Hello, ${item.name}!`;
  announcement.textContent = `${item.name} says hello`;
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
    playfield.classList.remove("reunion");
    void playfield.offsetWidth;
    playfield.classList.add("reunion");
    message.textContent = "Hello, friends!";
    message.classList.add("complete");
    announcement.textContent = `The friends are together. ${item.name} came from pocket ${index + 1}.`;
    return;
  }

  message.classList.remove("complete");
  if (result.open) {
    const pair = greetingPair(round, index);
    if (pair) {
      animateGreeting(pair);
      const partnerIndex = pair.find((value) => value !== index);
      const partner = getPocketItem(round.itemIds[partnerIndex]);
      message.textContent = `${item.name} meets ${partner.name}!`;
    } else {
      message.textContent = `${item.name}!`;
    }
  } else {
    message.textContent = "Peekaboo!";
  }
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
  const friend = event.target.closest(".pocket-friend");
  if (friend) {
    playFriend(Number(friend.dataset.index));
    return;
  }
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
