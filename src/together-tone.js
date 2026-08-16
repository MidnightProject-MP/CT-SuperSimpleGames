export const TONE_VOICES = Object.freeze(["berry", "sunny", "sky", "leaf"]);
export const TRAIL_LIMIT = 4;
export const LEVEL_COUNT = 5;

const VOICE_SET = new Set(TONE_VOICES);

function freezeLevels(levels) {
  return Object.freeze(Object.fromEntries(TONE_VOICES.map((id) => [id, levels[id]])));
}

function freezePair(pair) {
  return pair ? Object.freeze([...pair]) : null;
}

function createState(levels, trail, pair) {
  return Object.freeze({
    levels: freezeLevels(levels),
    trail: Object.freeze([...trail]),
    pair: freezePair(pair),
  });
}

function normalizeState(state) {
  if (!state || typeof state !== "object" || !state.levels || !Array.isArray(state.trail)) {
    throw new TypeError("invalid together tones state");
  }
  const levels = {};
  for (const id of TONE_VOICES) {
    const level = state.levels[id];
    if (!Number.isInteger(level) || level < 0 || level >= LEVEL_COUNT) {
      throw new RangeError(`invalid level for ${id}`);
    }
    levels[id] = level;
  }
  if (state.trail.length > TRAIL_LIMIT || state.trail.some((id) => !VOICE_SET.has(id))) {
    throw new RangeError("invalid together tones trail");
  }
  if (state.pair !== null && (!Array.isArray(state.pair) || state.pair.length !== 2
    || state.pair.some((id) => !VOICE_SET.has(id)) || state.pair[0] === state.pair[1])) {
    throw new RangeError("invalid together tones pair");
  }
  const recent = state.trail.slice(-2);
  const expectedPair = recent.length === 2 && recent[0] !== recent[1] ? recent : null;
  if ((expectedPair === null) !== (state.pair === null)
    || (expectedPair && (state.pair[0] !== expectedPair[0] || state.pair[1] !== expectedPair[1]))) {
    throw new RangeError("together tones pair does not match its recent trail");
  }
  return { levels, trail: [...state.trail], pair: state.pair ? [...state.pair] : null };
}

export function createToneState() {
  return createState(Object.fromEntries(TONE_VOICES.map((id) => [id, 0])), [], null);
}

export function activateVoice(state, id) {
  const current = normalizeState(state);
  if (!VOICE_SET.has(id)) throw new RangeError(`unknown tone voice: ${id}`);

  const previous = current.trail.at(-1) ?? null;
  const mode = previous === null ? "hello" : previous === id ? "echo" : "together";
  const levels = { ...current.levels, [id]: (current.levels[id] + 1) % LEVEL_COUNT };
  const trail = [...current.trail, id].slice(-TRAIL_LIMIT);
  const pair = mode === "together" ? [previous, id] : null;
  const nextState = createState(levels, trail, pair);

  return Object.freeze({
    state: nextState,
    id,
    previous,
    mode,
    level: levels[id],
  });
}
