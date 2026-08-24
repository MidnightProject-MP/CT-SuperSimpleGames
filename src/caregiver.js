import { loadSoundPreference, saveSoundPreference } from "./settings.js";
import { defaultCaregiverSettings, loadCaregiverSettings, saveCaregiverSettings } from "./caregiver-settings.js";

const RESET_CONFIRM_MESSAGE = "Clear all SuperSimpleGames settings and saved creations on this device?";
const CLEAR_CREATIONS_MESSAGE = "Clear saved gardens, scenes, and boards on this device? Settings stay unchanged.";
const RESET_GROWTH_MESSAGE = "Reset playful growth? Each game will start adapting from the beginning again.";
const SETTINGS_PREFIX = "supersimplegames.";
const LEGACY_SOUND_STORAGE_KEY = "bloom.sound-enabled";

const soundToggle = document.querySelector("#sound-toggle");
const sessionButtons = [...document.querySelectorAll("[data-session]")];
const levelButtons = [...document.querySelectorAll("[data-level]")];
const worldInputs = [...document.querySelectorAll("input[name='world']")];
const clearCreationsButton = document.querySelector("#clear-creations");
const creationsMessage = document.querySelector("#creations-message");
const resetGrowthButton = document.querySelector("#reset-growth");
const growthMessage = document.querySelector("#growth-message");
const resetButton = document.querySelector("#reset-all");
const resetMessage = document.querySelector("#reset-message");

let settings = loadCaregiverSettings();
render();

soundToggle.addEventListener("click", () => {
  saveSoundPreference(soundToggle.getAttribute("aria-pressed") !== "true");
  renderSound();
});

sessionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    update({ sessionMinutes: button.dataset.session ? Number(button.dataset.session) : null });
  });
});

levelButtons.forEach((button) => {
  button.addEventListener("click", () => {
    update({ level: button.dataset.level || null });
  });
});

worldInputs.forEach((input) => {
  input.addEventListener("change", () => {
    if (worldInputs.every((other) => !other.checked)) {
      input.checked = true;
      return;
    }
    update({ hiddenWorlds: worldInputs.filter((other) => !other.checked).map((other) => other.value) });
  });
});

clearCreationsButton.addEventListener("click", () => {
  if (!globalThis.confirm(CLEAR_CREATIONS_MESSAGE)) return;
  clearCreations();
  creationsMessage.hidden = false;
});

resetGrowthButton.addEventListener("click", () => {
  if (!globalThis.confirm(RESET_GROWTH_MESSAGE)) return;
  clearAdaptiveGrowth();
  growthMessage.hidden = false;
});

resetButton.addEventListener("click", () => {
  if (!globalThis.confirm(RESET_CONFIRM_MESSAGE)) return;
  clearAllStorage();
  settings = defaultCaregiverSettings();
  render();
  resetMessage.hidden = false;
});

function update(change) {
  saveCaregiverSettings({ ...settings, ...change });
  if ("sessionMinutes" in change) syncSessionStart(change.sessionMinutes == null);
  settings = loadCaregiverSettings();
  render();
}

function syncSessionStart(off) {
  try {
    const storage = globalThis.localStorage;
    if (!storage) return;
    if (off) storage.removeItem(`${SETTINGS_PREFIX}session-start`);
    else storage.setItem(`${SETTINGS_PREFIX}session-start`, String(Date.now()));
  } catch {}
}

function render() {
  renderSound();
  for (const button of sessionButtons) {
    const minutes = button.dataset.session ? Number(button.dataset.session) : null;
    button.setAttribute("aria-pressed", String(settings.sessionMinutes === minutes));
  }
  for (const button of levelButtons) {
    button.setAttribute("aria-pressed", String(settings.level === (button.dataset.level || null)));
  }
  for (const input of worldInputs) {
    input.checked = !settings.hiddenWorlds.includes(input.value);
  }
}

function renderSound() {
  const enabled = loadSoundPreference();
  soundToggle.setAttribute("aria-pressed", String(enabled));
  soundToggle.textContent = enabled ? "On" : "Off";
}

function clearCreations() {
  try {
    const storage = globalThis.localStorage;
    if (!storage) return;
    const doomed = [];
    for (let index = 0; index < storage.length; index += 1) {
      const key = storage.key(index);
      if (key != null && key.startsWith(SETTINGS_PREFIX) && key.endsWith(".creation")) doomed.push(key);
    }
    doomed.forEach((key) => storage.removeItem(key));
  } catch {}
}

function clearAdaptiveGrowth() {
  try {
    const storage = globalThis.localStorage;
    if (!storage) return;
    const doomed = [];
    for (let index = 0; index < storage.length; index += 1) {
      const key = storage.key(index);
      if (key != null && key.startsWith(SETTINGS_PREFIX) && key.endsWith(".adaptive")) doomed.push(key);
    }
    doomed.forEach((key) => storage.removeItem(key));
  } catch {}
}

function clearAllStorage() {
  try {
    const storage = globalThis.localStorage;
    if (!storage) return;
    const doomed = [];
    for (let index = 0; index < storage.length; index += 1) {
      const key = storage.key(index);
      if (key != null && (key.startsWith(SETTINGS_PREFIX) || key === LEGACY_SOUND_STORAGE_KEY)) doomed.push(key);
    }
    doomed.forEach((key) => storage.removeItem(key));
  } catch {}
}
