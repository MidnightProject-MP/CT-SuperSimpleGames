import {
  BLOOM_STAGES,
  BLOOM_TIERS,
  COLORS,
  MAX_BLOOMS,
  MAX_SPARKS,
  GARDEN_VISITOR_TOUCHES,
  TREE_DISSOLUTION_DISTANCE_FACTOR,
  clampPosition,
  createBloom,
  growBloom,
  gardenNeighborhoods,
  gardenVisitorFor,
  isRainbowTree,
  nearestBloom,
  neighborDistanceForLayout,
  planBloomPull,
  planBloomSettle,
  planBouquetGather,
  planGardenInteraction,
  planGardenMerge,
  planTreeDissolution,
  restoreGardenState,
  serializeGardenState,
  moveGardenVisitor
} from "./game.js";
import { createTonePlayer } from "./audio.js";
import { setupFreshStart } from "./fresh-start.js";
import { createPointerSampler } from "./interaction.js";
import { clearLocalState, loadLocalState, saveLocalState } from "./local-state.js";
import { loadSoundPreference, saveSoundPreference } from "./settings.js";

const garden = document.querySelector("#garden");
const blooms = document.querySelector("#blooms");
const invitation = document.querySelector("#invitation");
const announcement = document.querySelector("#announcement");
const soundToggle = document.querySelector("#sound-toggle");
const visitorLayer = document.querySelector("#visitor-layer");

let bloomCount = 0;
const gardenBlooms = new Map();
const bloomElements = new Map();
const gardenLinks = [];
const gardenCanopies = [];
let soundEnabled = loadSoundPreference();
const tonePlayer = createTonePlayer({ initialEnabled: soundEnabled });
const pointerSampler = createPointerSampler();
let resizeFrame;
let visitorState = null;
let dismissedVisitorKey = null;
const GARDEN_STORAGE_KEY = "supersimplegames.bloom.creation";

const VISITOR_TONES = Object.freeze({ bee: 739.99, butterfly: 622.25, bird: 554.37 });

function visitorKey(visitor) {
  return visitor ? `${visitor.type}:${visitor.anchorIds.join("-")}` : null;
}

function createVisitorElement(visitor) {
  const button = document.createElement("button");
  const art = document.createElement("span");
  button.type = "button";
  button.className = "garden-visitor";
  button.dataset.type = visitor.type;
  button.setAttribute("aria-label", `${visitor.label}; touch to say hello`);
  art.className = "visitor-art";
  art.setAttribute("aria-hidden", "true");
  art.append(document.createElement("i"), document.createElement("i"), document.createElement("i"));
  button.append(art);
  return button;
}

function placeVisitor() {
  const element = visitorLayer.querySelector(".garden-visitor");
  if (!element || !visitorState) return;
  const point = moveGardenVisitor(visitorState.visitor, visitorState.visits, garden.clientWidth, garden.clientHeight);
  element.style.left = `${point.x}px`;
  element.style.top = `${point.y}px`;
}

function renderVisitor() {
  const reach = neighborDistanceForLayout(garden.clientWidth, garden.clientHeight);
  const visitor = gardenVisitorFor(gardenBlooms.values(), reach);
  const key = visitorKey(visitor);
  if (!visitor || key === dismissedVisitorKey) {
    visitorState = null;
    visitorLayer.replaceChildren();
    return;
  }
  if (visitorState?.key === key) {
    visitorState = { ...visitorState, visitor };
    placeVisitor();
    return;
  }
  dismissedVisitorKey = null;
  visitorState = { key, visitor, visits: 0 };
  visitorLayer.replaceChildren(createVisitorElement(visitor));
  placeVisitor();
  announcement.textContent = `${visitor.label} came to visit the garden`;
  tonePlayer.play(VISITOR_TONES[visitor.type]);
}

function renderSoundState() {
  soundToggle.setAttribute("aria-pressed", String(soundEnabled));
  soundToggle.setAttribute("aria-label", soundEnabled ? "Turn sound off" : "Turn sound on");
}

function persistGarden() {
  if (garden.clientWidth <= 0 || garden.clientHeight <= 0) return false;
  return saveLocalState(GARDEN_STORAGE_KEY, serializeGardenState(gardenBlooms.values(), bloomCount, garden.clientWidth, garden.clientHeight));
}

function restoreGarden() {
  const saved = loadLocalState(GARDEN_STORAGE_KEY);
  if (!saved || garden.clientWidth <= 0 || garden.clientHeight <= 0) return false;
  try {
    const restored = restoreGardenState(saved, garden.clientWidth, garden.clientHeight);
    bloomCount = restored.nextId;
    for (const bloom of restored.blooms) {
      gardenBlooms.set(bloom.id, bloom);
      const flower = makeFlower(bloom);
      bloomElements.set(bloom.id, flower);
      blooms.append(flower);
    }
    invitation.classList.toggle("hidden", restored.blooms.length > 0);
    renderNeighborhoods();
    return true;
  } catch {
    clearLocalState(GARDEN_STORAGE_KEY);
    return false;
  }
}

function freshGarden() {
  bloomCount = 0;
  gardenBlooms.clear();
  bloomElements.clear();
  gardenLinks.length = 0;
  gardenCanopies.length = 0;
  blooms.replaceChildren();
  visitorLayer.replaceChildren();
  visitorState = null;
  dismissedVisitorKey = null;
  invitation.classList.remove("hidden");
  clearLocalState(GARDEN_STORAGE_KEY);
  announcement.textContent = "A fresh garden is ready";
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
  flower.dataset.tier = String(bloom.tier || 0);
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

  const mergeGrowth = document.createElement("span");
  mergeGrowth.className = "merge-growth";
  mergeGrowth.setAttribute("aria-hidden", "true");
  mergeGrowth.append(document.createElement("i"), document.createElement("i"), document.createElement("i"));
  flower.append(mergeGrowth);
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
  flower.dataset.tier = String(bloom.tier || 0);
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
  renderVisitor();
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
  const reach = neighborDistanceForLayout(garden.clientWidth, garden.clientHeight);
  let bloom = createBloom(bloomCount, x, y, garden.clientWidth, garden.clientHeight);
  bloomCount += 1;
  bloom = planBloomSettle(bloom, gardenBlooms.values(), { reach, width: garden.clientWidth, height: garden.clientHeight }) ?? bloom;
  invitation.classList.add("hidden");
  const neighbor = nearestBloom(gardenBlooms.values(), bloom.x, bloom.y, {
    maxDistance: reach
  });
  gardenBlooms.set(bloom.id, bloom);
  const flower = makeFlower(bloom);
  bloomElements.set(bloom.id, flower);
  blooms.append(flower);
  addSparkles(bloom);
  const merged = mergeNearbyBlooms();
  const dissolved = dissolveTrees();
  if (dissolved) {
    renderNeighborhoods();
    announcement.textContent = "the flowering trees drifted away";
    tonePlayer.play(880 * 1.26);
    return;
  }
  if (merged) {
    renderNeighborhoods();
    announceMerge(merged);
    return;
  }
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

function announceMerge(merged) {
  if (isRainbowTree(merged)) {
    announcement.textContent = "a rainbow tree!";
    tonePlayer.play(880 * 1.26);
    addSparkles(merged);
    addSparkles(merged);
    return;
  }
  const tier = BLOOM_TIERS[merged.tier];
  announcement.textContent = `${merged.mergedCount} flowers became a ${tier.label}!`;
  tonePlayer.play(merged.color.tone * (1 + merged.tier * 0.14));
}

function mergeNearbyBlooms() {
  let finalBloom = null;
  const reach = neighborDistanceForLayout(garden.clientWidth, garden.clientHeight);
  const options = { width: garden.clientWidth, height: garden.clientHeight };
  let plan = planGardenMerge(gardenBlooms.values(), reach, options);
  while (plan) {
    for (const id of plan.ids) {
      gardenBlooms.delete(id);
      bloomElements.get(id)?.remove();
      bloomElements.delete(id);
    }
    const placed = planBouquetGather(plan.bloom, gardenBlooms.values(), {
      reach,
      width: garden.clientWidth,
      height: garden.clientHeight
    }) ?? plan.bloom;
    gardenBlooms.set(placed.id, placed);
    const flower = makeFlower(placed);
    flower.classList.add("merged");
    bloomElements.set(placed.id, flower);
    blooms.append(flower);
    addSparkles(placed);
    finalBloom = placed;
    plan = planGardenMerge(gardenBlooms.values(), reach, options);
  }
  return finalBloom;
}

function dissolveTrees() {
  const distance = neighborDistanceForLayout(garden.clientWidth, garden.clientHeight) * TREE_DISSOLUTION_DISTANCE_FACTOR;
  let dissolvedAny = false;
  for (;;) {
    const ids = planTreeDissolution(gardenBlooms.values(), { distance });
    if (!ids) break;
    for (const id of ids) {
      const tree = gardenBlooms.get(id);
      if (tree) addSparkles(tree);
      gardenBlooms.delete(id);
      bloomElements.get(id)?.remove();
      bloomElements.delete(id);
    }
    dissolvedAny = true;
  }
  return dissolvedAny;
}

function tendBloom(id) {
  const current = gardenBlooms.get(id);
  if (!current) return;
  const grown = growBloom(current, { width: garden.clientWidth, height: garden.clientHeight });
  const bloom = planBloomPull(grown, gardenBlooms.values(), {
    width: garden.clientWidth,
    height: garden.clientHeight
  }) ?? grown;
  gardenBlooms.set(id, bloom);
  const flower = bloomElements.get(id);
  updateFlower(flower, bloom);
  const merged = mergeNearbyBlooms();
  const dissolved = dissolveTrees();
  if (dissolved) {
    renderNeighborhoods();
    announcement.textContent = "the flowering trees drifted away";
    tonePlayer.play(880 * 1.26);
    return;
  }
  if (merged) {
    renderNeighborhoods();
    announceMerge(merged);
    return;
  }
  const neighborhoods = renderNeighborhoods();
  animateFlower(flower);
  addSparkles(bloom);
  const stage = BLOOM_STAGES[bloom.stage];
  const inCanopy = neighborhoods.canopies.some(({ ids }) => ids.includes(bloom.id));
  const tier = BLOOM_TIERS[bloom.tier || 0];
  announcement.textContent = `${bloom.color.name} ${tier.label}, ${stage.label}${inCanopy ? ", under a shared canopy" : ""}`;
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
    persistGarden();
    return;
  }
  tendBloom(plan.id);
  persistGarden();
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
  if (event.target.closest("a, button, .fresh-dialog")) return;
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

visitorLayer.addEventListener("click", (event) => {
  const visitor = event.target.closest(".garden-visitor");
  if (!visitor || !visitorState) return;
  event.stopPropagation();
  const visits = visitorState.visits + 1;
  if (visits >= GARDEN_VISITOR_TOUCHES) {
    dismissedVisitorKey = visitorState.key;
    const label = visitorState.visitor.label;
    visitorState = null;
    visitor.classList.add("leaving");
    visitor.addEventListener("animationend", () => visitorLayer.replaceChildren(), { once: true });
    announcement.textContent = `${label} flies away. Every flower stays safe.`;
    tonePlayer.play(VISITOR_TONES[visitor.dataset.type] * 0.86);
    return;
  }
  visitorState = { ...visitorState, visits };
  placeVisitor();
  visitor.classList.remove("visiting");
  void visitor.offsetWidth;
  visitor.classList.add("visiting");
  announcement.textContent = `${visitorState.visitor.label} visits another flower`;
  tonePlayer.play(VISITOR_TONES[visitor.dataset.type] * (1 + visits * 0.025));
});

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState !== "hidden") return;
  void tonePlayer.suspend();
});

addEventListener("pagehide", tonePlayer.stop);
addEventListener("pagehide", persistGarden);
addEventListener("resize", () => {
  cancelAnimationFrame(resizeFrame);
  resizeFrame = requestAnimationFrame(reflowBlooms);
});

renderSoundState();
restoreGarden();
setupFreshStart({ onConfirm: freshGarden });

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  const workerUrl = new URL("../sw.js", import.meta.url);
  addEventListener("load", () => navigator.serviceWorker.register(workerUrl));
}
