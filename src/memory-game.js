import { createTonePlayer } from "./audio.js";
import { loadSoundPreference, saveSoundPreference } from "./settings.js";
import { protectPlaySurface } from "./play-gesture.js";
import {
  closeMismatched,
  createMemoryRound,
  flipToken,
  hideTokens,
  isComplete
} from "./memory-core.js";
import { getPocketItem } from "./pocket-items.js";
import { startWindDown } from "./wind-down.js";

const TOKEN_POOL = Object.freeze(["cat", "duck", "bear", "star", "sun", "flower"]);
const WITNESS_MS = 1900;
const MISMATCH_MS = 1050;

const board = document.querySelector("#memory-board");
const prompt = document.querySelector("#memory-prompt");
const message = document.querySelector("#memory-message");
const announcement = document.querySelector("#announcement");
const soundToggle = document.querySelector("#sound-toggle");
const replayButton = document.querySelector("#hide-again");

let round;
let witnessTimer;
let mismatchTimer;
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

function createCardElement(token) {
  const item = getPocketItem(token.itemId);
  const card = document.createElement("button");
  card.type = "button";
  card.className = "memory-card";
  card.dataset.index = String(token.index);

  const face = document.createElement("span");
  face.className = "card-face";
  const art = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  art.setAttribute("viewBox", "0 0 100 100");
  art.setAttribute("aria-hidden", "true");
  const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
  use.setAttribute("href", `../../assets/pocket-friends.svg#${item.artId}`);
  art.append(use);
  face.append(art);

  const back = document.createElement("span");
  back.className = "card-back";
  back.dataset.pattern = token.index % 3;

  card.append(face, back);
  return card;
}

function renderBoard() {
  board.style.setProperty("--token-count", String(round.tokens.length));
  board.replaceChildren(...round.tokens.map(createCardElement));
}

function cards() {
  return [...board.querySelectorAll(".memory-card")];
}

function cardAt(index) {
  return board.querySelector(`.memory-card[data-index="${index}"]`);
}

function openCardDom(index) {
  cardAt(index)?.classList.add("open");
}

function say(text) {
  announcement.textContent = text;
}

function startWitnessPhase() {
  prompt.textContent = "Look who is hiding!";
  for (const card of cards()) card.classList.add("open", "peeking");
  clearTimeout(witnessTimer);
  witnessTimer = setTimeout(() => {
    round = hideTokens(round);
    for (const card of cards()) card.classList.remove("open", "peeking");
    prompt.textContent = "Find the pairs!";
    say("The friends are hiding. Find the matching pairs.");
    tonePlayer.play(392);
  }, WITNESS_MS);
}

function celebratePair(firstIndex, secondIndex) {
  const id = round.tokens[firstIndex].itemId;
  const item = getPocketItem(id);
  for (const index of [firstIndex, secondIndex]) {
    const card = cardAt(index);
    if (!card) continue;
    card.classList.remove("wobbling");
    void card.offsetWidth;
    card.classList.add("paired");
  }
  tonePlayer.play(item.tone * 1.25);
  message.textContent = `Two ${item.name}s together!`;
  say(`Two ${item.name} friends are together.`);
}

function handleOutcome(result, clickedIndex) {
  const flippedId = round.tokens[clickedIndex].itemId;
  const flippedItem = getPocketItem(flippedId);
  switch (result.outcome) {
    case "ignored": {
      const card = cardAt(clickedIndex);
      if (card) {
        card.classList.remove("wobbling");
        void card.offsetWidth;
        card.classList.add("wobbling");
      }
      break;
    }
    case "first-open": {
      openCardDom(clickedIndex);
      tonePlayer.play(flippedItem.tone);
      message.textContent = `A ${flippedItem.name}!`;
      say(`${flippedItem.name}. Where is the other ${flippedItem.name}?`);
      break;
    }
    case "matched": {
      const [firstIndex] = result.round.found.slice(-2);
      // Both faces must be visibly up before the pair celebrates.
      openCardDom(firstIndex);
      openCardDom(clickedIndex);
      celebratePair(firstIndex, clickedIndex);
      break;
    }
    case "mismatched": {
      const otherIndex = result.round.open.find((index) => index !== clickedIndex);
      openCardDom(clickedIndex);
      tonePlayer.play(flippedItem.tone * 0.86);
      const otherName = getPocketItem(round.tokens[otherIndex].itemId).name;
      message.textContent = `A ${otherName} and a ${flippedItem.name}`;
      say(`A ${otherName} and a ${flippedItem.name}. They hide again.`);
      clearTimeout(mismatchTimer);
      mismatchTimer = setTimeout(() => {
        round = closeMismatched(round);
        for (const card of cards()) {
          if (!result.round.found.includes(Number(card.dataset.index))) {
            card.classList.remove("open");
          }
        }
      }, MISMATCH_MS);
      break;
    }
    default:
      break;
  }
}

function settleIfComplete() {
  if (!isComplete(round)) return false;
  playfieldComplete();
  return true;
}

function playfieldComplete() {
  document.querySelector("#memory-playfield").classList.add("complete");
  prompt.textContent = "All the pairs!";
  message.textContent = "Everybody found their friend.";
  say("All the pairs are together.");
  replayButton.hidden = false;
  tonePlayer.play(659.25 * 1.25);
}

board.addEventListener("click", (event) => {
  const cardEl = event.target.closest(".memory-card");
  if (!cardEl || round.hidden === false) return;
  const index = Number(cardEl.dataset.index);
  const result = flipToken(round, index);
  if (result.outcome === "ignored" && !cardEl.classList.contains("open")) {
    // Still acknowledge the tap so no touch ever feels dead.
    cardEl.classList.remove("wobbling");
    void cardEl.offsetWidth;
    cardEl.classList.add("wobbling");
    return;
  }
  round = result.round;
  handleOutcome(result, index);
  settleIfComplete();
});

replayButton.addEventListener("click", () => {
  startRound(nextSeed());
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

function startRound(seed) {
  clearTimeout(witnessTimer);
  clearTimeout(mismatchTimer);
  replayButton.hidden = true;
  document.querySelector("#memory-playfield").classList.remove("complete");
  message.textContent = "";
  round = createMemoryRound({ seed, pairCount: 2, pool: TOKEN_POOL });
  renderBoard();
  startWitnessPhase();
}

renderSoundState();
protectPlaySurface();
startRound(nextSeed());
startWindDown({ lines: { "/games/memory/": "The pairs are going to sleep." } });

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  const workerUrl = new URL("../sw.js", import.meta.url);
  addEventListener("load", () => navigator.serviceWorker.register(workerUrl));
}
