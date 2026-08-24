import { loadCaregiverSettings } from "./caregiver-settings.js";
import { startWindDown } from "./wind-down.js";

const HOLD_MS = 1500;

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  const workerUrl = new URL("../sw.js", import.meta.url);
  addEventListener("load", () => navigator.serviceWorker.register(workerUrl));
}

applyHiddenWorlds();
setupGrownupsGate();
startWindDown({ lines: { "/": "The games are going to sleep." } });

function applyHiddenWorlds() {
  const cards = [...document.querySelectorAll(".game-card[data-world]")];
  const hidden = new Set(loadCaregiverSettings().hiddenWorlds);
  let visibleCount = 0;
  for (const card of cards) {
    card.classList.toggle("card-hidden", hidden.has(card.dataset.world));
    if (!hidden.has(card.dataset.world)) visibleCount += 1;
  }
  if (visibleCount === 0) for (const card of cards) card.classList.remove("card-hidden");
}

function setupGrownupsGate() {
  const gate = document.querySelector("#grownups-gate");
  if (!gate) return;
  let frame = 0;

  gate.addEventListener("keydown", (event) => {
    if ((event.key !== "Enter" && event.key !== " ") || event.repeat) return;
    event.preventDefault();
    open();
  });
  gate.addEventListener("pointerdown", startHold);
  gate.addEventListener("pointerup", cancelHold);
  gate.addEventListener("pointerleave", cancelHold);
  gate.addEventListener("pointercancel", cancelHold);
  gate.addEventListener("contextmenu", (event) => event.preventDefault());

  function startHold() {
    cancelHold();
    gate.classList.add("gate-holding");
    const startedAt = performance.now();
    const tick = () => {
      const progress = Math.min(1, (performance.now() - startedAt) / HOLD_MS);
      if (progress >= 1) {
        cancelHold();
        open();
        return;
      }
      gate.style.setProperty("--hold-progress", progress.toFixed(4));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
  }

  function cancelHold() {
    cancelAnimationFrame(frame);
    frame = 0;
    gate.classList.remove("gate-holding");
    gate.style.setProperty("--hold-progress", "0");
  }
}

function open() {
  location.assign("./caregiver.html");
}
