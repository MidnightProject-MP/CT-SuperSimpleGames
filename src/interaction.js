export const DRAG_INTERVAL_MS = 150;

export function createPointerSampler(interval = DRAG_INTERVAL_MS) {
  const lastAt = new Map();

  return {
    start(pointerId, at) {
      lastAt.set(pointerId, at);
    },

    sample(pointerId, at) {
      const previous = lastAt.get(pointerId);
      if (previous === undefined || at - previous < interval) return false;
      lastAt.set(pointerId, at);
      return true;
    },

    end(pointerId) {
      lastAt.delete(pointerId);
    },

    clear() {
      lastAt.clear();
    },

    get size() {
      return lastAt.size;
    }
  };
}
