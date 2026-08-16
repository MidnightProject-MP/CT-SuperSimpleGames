export const POCKET_ITEMS = Object.freeze({
  apple: Object.freeze({ symbol: "🍎", name: "apple", tone: 392.0 }),
  ball: Object.freeze({ symbol: "⚽", name: "ball", tone: 440.0 }),
  bear: Object.freeze({ symbol: "🧸", name: "teddy bear", tone: 349.23 }),
  bird: Object.freeze({ symbol: "🐦", name: "bird", tone: 523.25 }),
  cat: Object.freeze({ symbol: "🐱", name: "cat", tone: 466.16 }),
  duck: Object.freeze({ symbol: "🦆", name: "duck", tone: 493.88 }),
  flower: Object.freeze({ symbol: "🌼", name: "flower", tone: 415.3 }),
  moon: Object.freeze({ symbol: "🌙", name: "moon", tone: 329.63 }),
  star: Object.freeze({ symbol: "⭐", name: "star", tone: 587.33 }),
  sun: Object.freeze({ symbol: "☀️", name: "sun", tone: 554.37 })
});

export function getPocketItem(id) {
  const item = POCKET_ITEMS[id];
  if (!item) throw new RangeError(`unknown pocket item: ${id}`);
  return item;
}
