const BLOCKED_GESTURES = Object.freeze(["gesturestart", "gesturechange", "gestureend"]);

export function protectPlaySurface() {
  const block = (event) => event.preventDefault();
  for (const name of BLOCKED_GESTURES) {
    addEventListener(name, block, { passive: false });
  }
}
