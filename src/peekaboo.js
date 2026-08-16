import { createTonePlayer } from "./audio.js";
import { POCKET_CLUE, getPocketItem } from "./pocket-items.js";
import {
  createSearchRound,
  getPocketContentId,
  getSearchClue,
  getSearchScene,
  getTargetItemId,
  searchGreetingPair,
  toggleSearchPocket
} from "./peekaboo-search.js";
import { loadSoundPreference, saveSoundPreference } from "./settings.js";

const pocketRow = document.querySelector("#pocket-row");
const playfield = document.querySelector("#peek-playfield");
const prompt = document.querySelector("#peek-prompt");
const targetLabel = document.querySelector("#target-label");
const targetArt = document.querySelector("#target-art use");
const message = document.querySelector("#peek-message");
const announcement = document.querySelector("#announcement");
const soundToggle = document.querySelector("#sound-toggle");

let round = createSearchRound({ seed: nextSeed() });
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
  for (let index = 0; index < round.pockets.itemIds.length; index += 1) {
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
  const scene = getSearchScene(round);
  const clue = getSearchClue(round);
  playfield.dataset.scene = scene.id;
  for (const station of pocketRow.querySelectorAll(".pocket-station")) {
    const index = Number(station.dataset.index);
    const pocket = station.querySelector(".pocket");
    const friend = station.querySelector(".pocket-friend");
    const contentId = getPocketContentId(round, index);
    const item = contentId ? getPocketItem(contentId) : POCKET_CLUE;
    const isOpen = round.pockets.open[index];
    station.classList.toggle("open", isOpen);
    pocket.dataset.pattern = round.pockets.patternIds[index];
    pocket.setAttribute("aria-expanded", String(isOpen));
    pocket.setAttribute("aria-label", isOpen
      ? `${scene.containerName} ${index + 1}, open, ${contentId ? item.name : "a clue"} inside`
      : `${scene.containerName} ${index + 1}, closed`);
    friend.tabIndex = isOpen ? 0 : -1;
    friend.setAttribute("aria-hidden", String(!isOpen));
    friend.setAttribute("aria-label", contentId ? `Say hello to ${item.name}` : "Play with the little clue");
    friend.querySelector("use").setAttribute("href", `../../assets/pocket-friends.svg#${item.artId}`);
    if (!contentId) {
      friend.dataset.clueDirection = clue.direction;
      friend.dataset.pattern = clue.patternId;
      friend.setAttribute("aria-label", `Play with the clue pointing ${clue.direction}, matching the target ${scene.containerName}`);
    }
  }
}

function renderTarget() {
  const target = getPocketItem(getTargetItemId(round));
  targetArt.setAttribute("href", `../../assets/pocket-friends.svg#${target.artId}`);
  targetLabel.textContent = round.targetFound ? "Here you are" : "Where is";
  prompt.setAttribute("aria-label", round.targetFound
    ? `${target.name} found; the pockets remain open for play`
    : `Find the ${target.name}`);
  playfield.classList.toggle("target-found", round.targetFound);
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
  friend.classList.remove("saying-hello", "greeting-left", "greeting-right", "clue-left", "clue-right");
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
  if (!round.pockets.open[index]) return;
  const contentId = getPocketContentId(round, index);
  const item = contentId ? getPocketItem(contentId) : POCKET_CLUE;
  const pair = searchGreetingPair(round, index);
  tonePlayer.play(item.tone * 1.08);
  if (!contentId) {
    const clue = getSearchClue(round);
    animateFriend(index, `clue-${clue.direction}`);
    message.textContent = `The clue points ${clue.direction}!`;
    announcement.textContent = `The clue points ${clue.direction} and matches the target ${getSearchScene(round).containerName}`;
    return;
  }
  if (pair) {
    animateGreeting(pair);
    const partnerIndex = pair.find((value) => value !== index);
    const partner = getPocketItem(getPocketContentId(round, partnerIndex));
    message.textContent = `${item.name} and ${partner.name} say hello!`;
    announcement.textContent = `${item.name} and ${partner.name} greet each other`;
    return;
  }
  animateFriend(index);
  message.textContent = contentId ? `Hello, ${item.name}!` : "A little clue!";
  announcement.textContent = contentId ? `${item.name} says hello` : "The little clue wiggles";
}

function toggle(index) {
  const result = toggleSearchPocket(round, index);
  round = result.state;
  const pocket = pocketRow.querySelector(`.pocket[data-index="${index}"]`);
  const item = result.contentId ? getPocketItem(result.contentId) : POCKET_CLUE;
  renderPockets();
  renderTarget();
  animatePocket(pocket, result.open);
  const tone = result.completedNow ? item.tone * 1.25 : result.open ? item.tone : item.tone * 0.78;
  tonePlayer.play(tone);

  if (result.completedNow) {
    playfield.classList.remove("reunion");
    void playfield.offsetWidth;
    playfield.classList.add("reunion");
    message.textContent = "Everybody’s here!";
    message.classList.add("complete");
    announcement.textContent = `The friends are together. ${item.name} came from pocket ${index + 1}.`;
    return;
  }

  message.classList.remove("complete");
  if (result.open) {
    if (result.empty) {
      message.textContent = "A little clue!";
      announcement.textContent = `A playful clue came from pocket ${index + 1}`;
      return;
    }
    if (result.foundNow) {
      message.textContent = `${item.name}! Here you are!`;
      announcement.textContent = `${item.name} found in pocket ${index + 1}. The scene remains open for play.`;
      return;
    }
    const pair = searchGreetingPair(round, index);
    if (pair) {
      animateGreeting(pair);
      const partnerIndex = pair.find((value) => value !== index);
      const partner = getPocketItem(getPocketContentId(round, partnerIndex));
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
renderTarget();
renderSoundState();

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  const workerUrl = new URL("../sw.js", import.meta.url);
  addEventListener("load", () => navigator.serviceWorker.register(workerUrl));
}
