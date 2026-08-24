const CAREGIVER_STORAGE_KEY = "supersimplegames.caregiver-settings";
const SESSION_START_KEY = "supersimplegames.session-start";
const DEFAULT_LINE = "The games are going to sleep.";
const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

export function computeWindDown({ startedAt, minutes, now = Date.now() }) {
  if (!Number.isFinite(minutes) || minutes < 1) return "play";
  if (!Number.isFinite(startedAt)) return "play";
  if (now < startedAt - 60000) return "play";
  const remaining = minutes * 60000 - (now - startedAt);
  if (remaining <= 0) return "rest";
  if (remaining <= 120000) return "evening";
  return "play";
}

export function startWindDown({ lines = {}, onRest } = {}) {
  let resting = false;

  const readSession = () => {
    try {
      const settings = globalThis.localStorage?.getItem(CAREGIVER_STORAGE_KEY);
      const start = globalThis.localStorage?.getItem(SESSION_START_KEY);
      return {
        minutes: settings == null ? null : JSON.parse(settings)?.sessionMinutes,
        startedAt: start == null ? NaN : Number(start)
      };
    } catch {
      return { minutes: null, startedAt: NaN };
    }
  };

  const leaveRest = () => {
    resting = false;
    document.body.classList.remove("wind-down-evening", "wind-down-rest");
    document.querySelector(".wind-down-veil")?.remove();
    try {
      globalThis.localStorage?.removeItem(SESSION_START_KEY);
    } catch {}
    onRest?.();
  };

  const tick = () => {
    const phase = computeWindDown(readSession());
    document.body.classList.remove("wind-down-evening", "wind-down-rest");
    if (phase === "play") {
      resting = false;
      return;
    }
    document.body.classList.add("wind-down-evening");
    if (phase !== "rest") return;
    document.body.classList.add("wind-down-rest");
    if (!resting) {
      resting = true;
      document.body.append(createVeil(lineFor(lines), leaveRest));
    }
  };

  tick();
  setInterval(tick, 5000);
}

function lineFor(lines) {
  const path = window.location.pathname;
  if (Object.hasOwn(lines, path)) return lines[path];
  const suffix = Object.keys(lines).find((key) => path.endsWith(key));
  return suffix ? lines[suffix] : DEFAULT_LINE;
}

function createVeil(line, onSun) {
  const veil = document.createElement("div");
  veil.className = "wind-down-veil";
  veil.setAttribute("role", "status");

  const moon = document.createElementNS(SVG_NAMESPACE, "svg");
  moon.classList.add("wind-down-moon");
  moon.setAttribute("viewBox", "0 0 24 24");
  moon.setAttribute("aria-hidden", "true");
  const mark = document.createElementNS(SVG_NAMESPACE, "path");
  mark.setAttribute("d", "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z");
  moon.append(mark);

  const lineElement = document.createElement("p");
  lineElement.className = "wind-down-line";
  lineElement.textContent = line;

  const sun = document.createElement("button");
  sun.type = "button";
  sun.className = "wind-down-sun";
  sun.textContent = "Play again";
  sun.addEventListener("click", onSun);

  veil.append(moon, lineElement, sun);
  return veil;
}
