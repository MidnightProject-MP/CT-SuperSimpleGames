// Numbers experiment core — pure quantity-as-event logic.
// The number means something the child did: items arrive, pile up, go back
// out. No quiz, no request, no wrong answer. Hard cap keeps sets subitizable.

export const NIBBLES_CAP = 5;

const TONE_STEPS = Object.freeze([262.0, 294.33, 330.0, 370.0, 415.3]);

function assertState(state) {
  if (!state || !Number.isInteger(state.count)) throw new TypeError("nibbles state needs an integer count");
}

export function createNibblesState() {
  return Object.freeze({ count: 0 });
}

/** One more item arrives. Returns null when the creature is satisfyingly full. */
export function addItem(state) {
  assertState(state);
  if (state.count >= NIBBLES_CAP) return null;
  return Object.freeze({ count: state.count + 1, event: "arrived" });
}

/** The most recent item hops back out. Returns null when the plate is empty. */
export function removeItem(state) {
  assertState(state);
  if (state.count <= 0) return null;
  return Object.freeze({ count: state.count - 1, event: "released" });
}

/** Each quantity has its own step so the pile is also audible. */
export function toneFor(count) {
  if (!Number.isInteger(count) || count < 1 || count > NIBBLES_CAP) {
    throw new RangeError(`tone needs a count of 1..${NIBBLES_CAP}`);
  }
  return TONE_STEPS[count - 1];
}
