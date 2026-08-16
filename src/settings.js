export const SOUND_STORAGE_KEY = "supersimplegames.sound-enabled";
const LEGACY_SOUND_STORAGE_KEY = "bloom.sound-enabled";

export function loadSoundPreference(storage) {
  try {
    storage ??= globalThis.localStorage;
    const stored = storage?.getItem(SOUND_STORAGE_KEY);
    const value = stored ?? storage?.getItem(LEGACY_SOUND_STORAGE_KEY);
    return value !== "false";
  } catch {
    return true;
  }
}

export function saveSoundPreference(enabled, storage) {
  try {
    storage ??= globalThis.localStorage;
    storage?.setItem(SOUND_STORAGE_KEY, String(Boolean(enabled)));
    return true;
  } catch {
    return false;
  }
}
