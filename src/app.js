import {
  BLOOM_STAGES,
  COLORS,
  MAX_BLOOMS,
  MAX_SPARKS,
  clampPosition,
  createBloom,
  growBloom,
  gardenNeighborhoods,
  nearestBloom,
  neighborDistanceForLayout,
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
const bloomElements = new Map();
const gardenLinks = [];
const gardenCanopies = [];
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
  flower.dataset.stage = String(bloom.stage);
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

  const leaves = document.createElement("span");
  leaves.className = "growth-leaves";
  leaves.setAttribute("aria-hidden", "true");
  leaves.append(document.createElement("i"), document.createElement("i"));
  flower.append(leaves);

  const seeds = document.createElement("span");
  seeds.className = "seed-dots";
  seeds.setAttribute("aria-hidden", "true");
  flower.append(seeds);
  return flower;
}

function updateFlower(flower, bloom) {
  flower.style.left = `${bloom.x}px`;
  flower.style.top = `${bloom.y}px`;
  flower.style.setProperty("--size", `${bloom.size}px`);
  flower.dataset.x = String(bloom.x);
  flower.dataset.y = String(bloom.y);
  flower.dataset.size = String(bloom.size);
  flower.dataset.stage = String(bloom.stage);
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
  for (const link of gardenLinks) updateLink(link);
}

function createNeighborhoodLink(first, second, type) {
  const link = document.createElement("i");
  link.className = "bloom-link";
  link.dataset.first = String(first.id);
  link.dataset.second = String(second.id);
  link.dataset.type = type;
  blooms.prepend(link);
  gardenLinks.push(link);
  updateLink(link);

}

function renderNeighborhoods() {
  for (const element of gardenLinks) element.remove();
  for (const element of gardenCanopies) element.remove();
  gardenLinks.length = 0;
  gardenCanopies.length = 0;
  const reach = neighborDistanceForLayout(garden.clientWidth, garden.clientHeight);
  const neighborhoods = gardenNeighborhoods(gardenBlooms.values(), reach);
  for (const relationship of neighborhoods.links) {
    createNeighborhoodLink(gardenBlooms.get(relationship.first), gardenBlooms.get(relationship.second), relationship.type);
  }
  for (const canopy of neighborhoods.canopies) {
    const group = canopy.ids.map((id) => gardenBlooms.get(id));
    const element = document.createElement("i");
    element.className = "garden-canopy";
    element.style.left = `${group.reduce((sum, bloom) => sum + bloom.x, 0) / group.length}px`;
    element.style.top = `${group.reduce((sum, bloom) => sum + bloom.y, 0) / group.length}px`;
    blooms.prepend(element);
    gardenCanopies.push(element);
  }
  return neighborhoods;
}

function animateFlower(flower, className = "tended") {
  flower.classList.remove("tended", "greet-left", "greet-right");
  void flower.offsetWidth;
  flower.classList.add(className);
}

function addSparkles(bloom) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const overflow = blooms.querySelectorAll(".spark").length + 4 - MAX_SPARKS;
  if (overflow > 0) {
    for (const spark of [...blooms.querySelectorAll(".spark")].slice(0, overflow)) spark.remove();
  }

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
  const neighbor = nearestBloom(gardenBlooms.values(), bloom.x, bloom.y, {
    maxDistance: neighborDistanceForLayout(garden.clientWidth, garden.clientHeight)
  });
  gardenBlooms.set(bloom.id, bloom);
  const flower = makeFlower(bloom);
  bloomElements.set(bloom.id, flower);
  blooms.append(flower);
  addSparkles(bloom);
  const neighborhoods = renderNeighborhoods();
  if (neighbor) {
    const relationship = neighborhoods.links.find(({ first, second }) => (
      (first === bloom.id && second === neighbor.id) || (first === neighbor.id && second === bloom.id)
    ));
    const firstClass = bloom.x <= neighbor.x ? "greet-right" : "greet-left";
    const secondClass = bloom.x <= neighbor.x ? "greet-left" : "greet-right";
    animateFlower(bloomElements.get(neighbor.id), secondClass);
    flower.addEventListener("animationend", () => animateFlower(flower, firstClass), { once: true });
    announcement.textContent = `${bloom.color.name} flower made ${relationship?.type === "harmony" ? "a matching harmony" : "an alternating rhythm"}`;
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
  const flower = bloomElements.get(id);
  updateFlower(flower, bloom);
  const neighborhoods = renderNeighborhoods();
  animateFlower(flower);
  addSparkles(bloom);
  const stage = BLOOM_STAGES[bloom.stage];
  const inCanopy = neighborhoods.canopies.some(({ ids }) => ids.includes(bloom.id));
  announcement.textContent = `${bloom.color.name} flower, ${stage.label}${inCanopy ? ", under a shared canopy" : ""}`;
  tonePlayer.play(bloom.color.tone * stage.toneFactor);
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
  for (const [id, flower] of bloomElements) {
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
    gardenBlooms.set(id, { ...gardenBlooms.get(id), ...position });
  }
  renderNeighborhoods();
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
