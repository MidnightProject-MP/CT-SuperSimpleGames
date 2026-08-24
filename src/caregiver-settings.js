export const CAREGIVER_STORAGE_KEY = "supersimplegames.caregiver-settings";
export const WORLD_IDS = Object.freeze(["bloom", "color-splash", "peekaboo", "story-scenes", "memory", "numbers"]);

function isValidSession(value) {
  return Number.isInteger(value) && value >= 5 && value <= 60;
}

// Records from the retired fixed-level era may still carry a `level` field;
// sanitize silently drops it — per-game adaptation replaced that control.
function sanitizeCaregiverSettings(raw) {
  const source = raw && typeof raw === "object" ? raw : {};
  const hidden = Array.isArray(source.hiddenWorlds) ? source.hiddenWorlds : [];
  return Object.freeze({
    version: 1,
    sessionMinutes: isValidSession(source.sessionMinutes) ? source.sessionMinutes : null,
    hiddenWorlds: Object.freeze(WORLD_IDS.filter((id) => hidden.includes(id)))
  });
}

export function defaultCaregiverSettings() {
  return sanitizeCaregiverSettings(null);
}

export function loadCaregiverSettings(storage) {
  try {
    storage ??= globalThis.localStorage;
    const stored = storage?.getItem(CAREGIVER_STORAGE_KEY);
    return sanitizeCaregiverSettings(stored == null ? null : JSON.parse(stored));
  } catch {
    return sanitizeCaregiverSettings(null);
  }
}

export function saveCaregiverSettings(settings, storage) {
  try {
    storage ??= globalThis.localStorage;
    storage?.setItem(CAREGIVER_STORAGE_KEY, JSON.stringify(sanitizeCaregiverSettings(settings)));
    return true;
  } catch {
    return false;
  }
}

export function visibleWorlds(settings) {
  const hidden = new Set(Array.isArray(settings?.hiddenWorlds) ? settings.hiddenWorlds : []);
  return WORLD_IDS.filter((id) => !hidden.has(id));
}
