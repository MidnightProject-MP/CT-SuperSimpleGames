export const LOCAL_STATE_VERSION = 1;
export const MAX_LOCAL_STATE_BYTES = 24_000;

export function loadLocalState(key, storage, { version = LOCAL_STATE_VERSION, maxBytes = MAX_LOCAL_STATE_BYTES } = {}) {
  try {
    storage ??= globalThis.localStorage;
    const raw = storage?.getItem(key);
    if (typeof raw !== "string" || raw.length === 0 || raw.length > maxBytes) return null;
    const envelope = JSON.parse(raw);
    if (!envelope || envelope.version !== version || !("value" in envelope)) return null;
    return envelope.value;
  } catch {
    return null;
  }
}

export function saveLocalState(key, value, storage, { version = LOCAL_STATE_VERSION, maxBytes = MAX_LOCAL_STATE_BYTES } = {}) {
  try {
    storage ??= globalThis.localStorage;
    const raw = JSON.stringify({ version, value });
    if (raw.length > maxBytes) return false;
    storage?.setItem(key, raw);
    return true;
  } catch {
    return false;
  }
}

export function clearLocalState(key, storage) {
  try {
    storage ??= globalThis.localStorage;
    storage?.removeItem(key);
    return true;
  } catch {
    return false;
  }
}
