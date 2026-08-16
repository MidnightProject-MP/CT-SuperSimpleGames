import {
  COLORS,
  MAX_BLOOMS,
  NEIGHBOR_DISTANCE,
  clampPosition,
  createBloom,
  growBloom,
  nearestBloom,
  planGardenInteraction
} from "./game.js";
import { createTonePlayer } from "./audio.js";
import { createPointerSampler } from "./interaction.js";
import { loadSoundPreference, saveSoundPreference } from "./settings.js";

const garden = document.querySelector("#garden");
const blooms = document.querySelector("#blooms");
const invitation = document.querySelector("#invitation");
const announcement = document.querySelector("#announcement");
const soundToggle = document.querySelector("#sound-toggle");

let bloomCount = 0;
const gardenBlooms = new Map();
let soundEnabled = loadSoundPreference();
const tonePlayer = createTonePlayer({ initialEnabled: soundEnabled });
const pointerSampler = createPointerSampler();
let resizeFrame;

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
  flower.dataset.id = String(bloom.id);
  flower.setAttribute("role", "presentation");

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

function updateFlower(flower, bloom) {
  flower.style.left = `${bloom.x}px`;
  flower.style.top = `${bloom.y}px`;
  flower.style.setProperty("--size", `${bloom.size}px`);
  flower.dataset.x = String(bloom.x);
  flower.dataset.y = String(bloom.y);
  flower.dataset.size = String(bloom.size);
}

function updateLink(link) {
  const first = gardenBlooms.get(Number(link.dataset.first));
  const second = gardenBlooms.get(Number(link.dataset.second));
  if (!first || !second) return;
  const dx = second.x - first.x;
  const dy = second.y - first.y;
  link.style.left = `${first.x}px`;
  link.style.top = `${first.y}px`;
  link.style.width = `${Math.hypot(dx, dy)}px`;
  link.style.transform = `rotate(${Math.atan2(dy, dx)}rad)`;
}

function updateLinks() {
  for (const link of blooms.querySelectorAll(".bloom-link")) updateLink(link);
}

function connectBlooms(first, second) {
  const link = document.createElement("i");
  link.className = "bloom-link";
  link.dataset.first = String(first.id);
  link.dataset.second = String(second.id);
  blooms.prepend(link);
  updateLink(link);

  const firstFlower = blooms.querySelector(`.bloom[data-id="${first.id}"]`);
  const secondFlower = blooms.querySelector(`.bloom[data-id="${second.id}"]`);
  const firstClass = first.x <= second.x ? "greet-right" : "greet-left";
  const secondClass = first.x <= second.x ? "greet-left" : "greet-right";
  animateFlower(secondFlower, secondClass);
  firstFlower.addEventListener("animationend", () => animateFlower(firstFlower, firstClass), { once: true });
}

function animateFlower(flower, className = "tended") {
  flower.classList.remove("tended", "greet-left", "greet-right");
  void flower.offsetWidth;
  flower.classList.add(className);
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

function createAt(x, y) {
  const bloom = createBloom(bloomCount, x, y, garden.clientWidth, garden.clientHeight);
  bloomCount += 1;
  invitation.classList.add("hidden");
  const neighbor = nearestBloom(gardenBlooms.values(), bloom.x, bloom.y, { maxDistance: NEIGHBOR_DISTANCE });
  gardenBlooms.set(bloom.id, bloom);
  blooms.append(makeFlower(bloom));
  addSparkles(bloom);
  if (neighbor) {
    connectBlooms(bloom, neighbor);
    announcement.textContent = `${bloom.color.name} flower grew beside another flower`;
  } else {
    announcement.textContent = `${bloom.color.name} flower`;
  }
  tonePlayer.play(bloom.color.tone);
}

function tendBloom(id) {
  const current = gardenBlooms.get(id);
  if (!current) return;
  const bloom = growBloom(current, { width: garden.clientWidth, height: garden.clientHeight });
  gardenBlooms.set(id, bloom);
  const flower = blooms.querySelector(`.bloom[data-id="${id}"]`);
  updateFlower(flower, bloom);
  updateLinks();
  animateFlower(flower);
  addSparkles(bloom);
  announcement.textContent = `${bloom.color.name} flower grew again`;
  tonePlayer.play(bloom.color.tone * 1.06);
}

function interactAt(x, y, flower) {
  invitation.classList.add("hidden");
  const plan = planGardenInteraction(gardenBlooms.values(), x, y, {
    targetId: flower ? Number(flower.dataset.id) : undefined,
    limit: MAX_BLOOMS
  });
  if (plan.action === "create") {
    createAt(x, y);
    return;
  }
  tendBloom(plan.id);
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
    const id = Number(flower.dataset.id);
    gardenBlooms.set(id, { ...gardenBlooms.get(id), ...position });
  }
  updateLinks();
}

garden.addEventListener("pointerdown", (event) => {
  if (event.target.closest("a, button")) return;
  event.preventDefault();
  garden.setPointerCapture?.(event.pointerId);
  interactAt(event.clientX, event.clientY, event.target.closest(".bloom"));
  pointerSampler.start(event.pointerId, performance.now());
});

garden.addEventListener("pointermove", (event) => {
  if (!garden.hasPointerCapture?.(event.pointerId)) return;
  const now = performance.now();
  if (!pointerSampler.sample(event.pointerId, now)) return;
  interactAt(event.clientX, event.clientY, document.elementFromPoint(event.clientX, event.clientY)?.closest(".bloom"));
});

for (const eventName of ["pointerup", "pointercancel", "lostpointercapture"]) {
  garden.addEventListener(eventName, (event) => pointerSampler.end(event.pointerId));
}

garden.addEventListener("keydown", (event) => {
  if (event.target.closest("a, button")) return;
  if (event.key !== "Enter" && event.key !== " ") return;
  event.preventDefault();
  const offset = (bloomCount % COLORS.length) * 9;
  const x = garden.clientWidth / 2 + offset;
  const y = garden.clientHeight / 2 + offset;
  interactAt(x, y, null);
});

soundToggle.addEventListener("click", (event) => {
  event.stopPropagation();
  soundEnabled = !soundEnabled;
  tonePlayer.setEnabled(soundEnabled);
  saveSoundPreference(soundEnabled);
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
