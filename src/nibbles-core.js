// Numbers experiment v2 core — pure, seeded, deterministic.
// Owner direction: big real numerals are the interface. Tapping a number
// makes that many friends appear; the group is what the numeral means.

const TONE_STEPS = Object.freeze([262.0, 330.0, 392.0, 494.0, 587.33]);

export const NUMBER_CHOICES_DEFAULT = Object.freeze([1, 2, 3]);
// Documented maximum for L5 widening; unused until adaptation earns it.
export const NUMBER_CHOICES_RICH = Object.freeze([1, 2, 3, 4, 5]);

function assertCount(count) {
  if (!Number.isInteger(count) || count < 1 || count > NUMBER_CHOICES_RICH[NUMBER_CHOICES_RICH.length - 1]) {
    throw new RangeError(`spawn count must be an integer 1..${NUMBER_CHOICES_RICH[NUMBER_CHOICES_RICH.length - 1]}`);
  }
}

/** Each item of a spawned group gets its own rising step so quantity is audible. */
export function toneFor(order) {
  if (!Number.isInteger(order) || order < 0 || order >= NUMBER_CHOICES_RICH.length) {
    throw new RangeError(`tone order must be an integer 0..${NUMBER_CHOICES_RICH.length - 1}`);
  }
  return TONE_STEPS[order];
}

function mulberry32(seed) {
  let value = seed >>> 0;
  return function next() {
    value = (value + 0x6d2b79f5) >>> 0;
    let mixed = Math.imul(value ^ (value >>> 15), 1 | value);
    mixed = (mixed + Math.imul(mixed ^ (mixed >>> 7), 61 | mixed)) ^ mixed;
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Plans where `count` friends land in the scene: a jittered grid so friends
 * never crowd one spot. Positions are normalized fractions of the scene box.
 * Deterministic for a given seed; arrival order follows the plan index.
 */
export function createSpawnPlan({ count, seed }) {
  assertCount(count);
  if (!Number.isInteger(seed) || seed < 0) throw new RangeError("seed must be a non-negative integer");
  const random = mulberry32(seed);

  const cols = count <= 3 ? count : count === 4 ? 2 : 3;
  const rows = Math.ceil(count / cols);
  const cellW = 0.84 / cols;
  const cellH = 0.62 / rows;

  const cells = [];
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) cells.push([col, row]);
  }
  // Deterministic shuffle so which cell a friend takes varies by seed while
  // spacing guarantees survive.
  for (let i = cells.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [cells[i], cells[j]] = [cells[j], cells[i]];
  }

  const friends = [];
  for (let index = 0; index < count; index += 1) {
    const [col, row] = cells[index];
    const x = Math.min(0.91, Math.max(0.09,
      0.08 + cellW * (col + 0.5) + (random() - 0.5) * cellW * 0.5));
    const y = Math.min(0.82, Math.max(0.14,
      0.16 + cellH * (row + 0.5) + (random() - 0.5) * cellH * 0.5));
    friends.push({
      index,
      x: Math.round(x * 1000) / 1000,
      y: Math.round(y * 1000) / 1000,
      order: index,
    });
  }
  return Object.freeze(friends);
}
