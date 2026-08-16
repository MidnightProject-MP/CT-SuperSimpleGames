export const POCKET_ITEMS = Object.freeze({
  apple: Object.freeze({ artId: "friend-apple", name: "apple", tone: 392.0 }),
  ball: Object.freeze({ artId: "friend-ball", name: "ball", tone: 440.0 }),
  bear: Object.freeze({ artId: "friend-bear", name: "teddy bear", tone: 349.23 }),
  bird: Object.freeze({ artId: "friend-bird", name: "bird", tone: 523.25 }),
  cat: Object.freeze({ artId: "friend-cat", name: "cat", tone: 466.16 }),
  duck: Object.freeze({ artId: "friend-duck", name: "duck", tone: 493.88 }),
  flower: Object.freeze({ artId: "friend-flower", name: "flower", tone: 415.3 }),
  moon: Object.freeze({ artId: "friend-moon", name: "moon", tone: 329.63 }),
  star: Object.freeze({ artId: "friend-star", name: "star", tone: 587.33 }),
  sun: Object.freeze({ artId: "friend-sun", name: "sun", tone: 554.37 })
});

export function getPocketItem(id) {
  const item = POCKET_ITEMS[id];
  if (!item) throw new RangeError(`unknown pocket item: ${id}`);
  return item;
}
