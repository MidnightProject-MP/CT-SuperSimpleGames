import { COLORS, MAX_BLOOMS, clampPosition, createBloom } from "./game.js";
import { createTonePlayer } from "./audio.js";
import { createPointerSampler } from "./interaction.js";

const SOUND_STORAGE_KEY = "bloom.sound-enabled";

const garden = document.querySelector("#garden");
const blooms = document.querySelector("#blooms");
const invitation = document.querySelector("#invitation");
const announcement = document.querySelector("#announcement");
const soundToggle = document.querySelector("#sound-toggle");

let bloomCount = 0;
let soundEnabled = loadSoundPreference();
const tonePlayer = createTonePlayer({ initialEnabled: soundEnabled });
const pointerSampler = createPointerSampler();
let resizeFrame;

function loadSoundPreference() {
  try {
    return localStorage.getItem(SOUND_STORAGE_KEY) !== "false";
  } catch {
    return true;
  }
}

function saveSoundPreference() {
  try {
    localStorage.setItem(SOUND_STORAGE_KEY, String(soundEnabled));
  } catch {
    // Storage may be unavailable in private or restricted browsing modes.
  }
}

function renderSoundState() {
  soundToggle.setAttribute("aria-pressed", String(soundEnabled));
  soundToggle.setAttribute("aria-label", soundEnabled ? "Turn sound off" : "Turn sound on");
}

function petalTransform(index, total) {
  const angle = (360 / total) * index;
  return `rotate(${angle}deg) translateY(-78%)`;
}

function makeFlower(bloom) {
  const flower = document.createElement("div");
  flower.className = "bloom";
  flower.style.left = `${bloom.x}px`;
  flower.style.top = `${bloom.y}px`;
  flower.style.setProperty("--size", `${bloom.size}px`);
  flower.style.setProperty("--petal", bloom.color.petal);
  flower.style.setProperty("--petal-light", bloom.color.light);
  flower.dataset.x = String(bloom.x);
  flower.dataset.y = String(bloom.y);
  flower.dataset.size = String(bloom.size);

  for (let i = 0; i < bloom.petals; i += 1) {
    const petal = document.createElement("i");
    petal.className = "petal";
    petal.style.transform = petalTransform(i, bloom.petals);
    flower.append(petal);
  }

  const core = document.createElement("b");
  core.className = "flower-core";
  flower.append(core);
  return flower;
}

function addSparkles(bloom) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  for (let i = 0; i < 4; i += 1) {
    const spark = document.createElement("i");
    const angle = (Math.PI * 2 * i) / 4 + (bloom.id % 3) * 0.35;
    const distance = bloom.size * 0.62;
    spark.className = "spark";
    spark.style.left = `${bloom.x}px`;
    spark.style.top = `${bloom.y}px`;
    spark.style.setProperty("--spark", bloom.color.light);
    spark.style.setProperty("--drift-x", `${Math.cos(angle) * distance}px`);
    spark.style.setProperty("--drift-y", `${Math.sin(angle) * distance}px`);
    spark.addEventListener("animationend", () => spark.remove(), { once: true });
    blooms.append(spark);
  }
}

function growAt(x, y) {
  const bloom = createBloom(bloomCount, x, y, garden.clientWidth, garden.clientHeight);
  bloomCount += 1;
  invitation.classList.add("hidden");
  blooms.append(makeFlower(bloom));
  addSparkles(bloom);
  announcement.textContent = `${bloom.color.name} flower`;

  while (blooms.querySelectorAll(".bloom").length > MAX_BLOOMS) {
    blooms.querySelector(".bloom")?.remove();
  }

  tonePlayer.play(bloom.color.tone);
}

function reflowBlooms() {
  for (const flower of blooms.querySelectorAll(".bloom")) {
    const size = Number(flower.dataset.size);
    const position = clampPosition(
      Number(flower.dataset.x),
      Number(flower.dataset.y),
      garden.clientWidth,
      garden.clientHeight,
      size * 0.43
    );
    flower.dataset.x = String(position.x);
    flower.dataset.y = String(position.y);
    flower.style.left = `${position.x}px`;
    flower.style.top = `${position.y}px`;
  }
}

garden.addEventListener("pointerdown", (event) => {
  if (event.target.closest("button")) return;
  event.preventDefault();
  garden.setPointerCapture?.(event.pointerId);
  growAt(event.clientX, event.clientY);
  pointerSampler.start(event.pointerId, performance.now());
});

garden.addEventListener("pointermove", (event) => {
  if (!garden.hasPointerCapture?.(event.pointerId)) return;
  const now = performance.now();
  if (!pointerSampler.sample(event.pointerId, now)) return;
  growAt(event.clientX, event.clientY);
});

for (const eventName of ["pointerup", "pointercancel", "lostpointercapture"]) {
  garden.addEventListener(eventName, (event) => pointerSampler.end(event.pointerId));
}

garden.addEventListener("keydown", (event) => {
  if (event.target.closest("button")) return;
  if (event.key !== "Enter" && event.key !== " ") return;
  event.preventDefault();
  const offset = (bloomCount % COLORS.length) * 9;
  growAt(garden.clientWidth / 2 + offset, garden.clientHeight / 2 + offset);
});

soundToggle.addEventListener("click", (event) => {
  event.stopPropagation();
  soundEnabled = !soundEnabled;
  tonePlayer.setEnabled(soundEnabled);
  saveSoundPreference();
  renderSoundState();
  if (soundEnabled) tonePlayer.play(COLORS[bloomCount % COLORS.length].tone);
});

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState !== "hidden") return;
  void tonePlayer.suspend();
});

addEventListener("pagehide", tonePlayer.stop);
addEventListener("resize", () => {
  cancelAnimationFrame(resizeFrame);
  resizeFrame = requestAnimationFrame(reflowBlooms);
});

renderSoundState();

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  const workerUrl = new URL("../sw.js", import.meta.url);
  addEventListener("load", () => navigator.serviceWorker.register(workerUrl));
}
