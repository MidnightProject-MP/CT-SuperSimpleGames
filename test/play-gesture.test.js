import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");

const CHILD_ENTRIES = Object.freeze([
  ["src/launcher.js", "./play-gesture.js"],
  ["src/app.js", "./play-gesture.js"],
  ["src/color-splash.js", "./play-gesture.js"],
  ["src/peekaboo.js", "./play-gesture.js"],
  ["src/story-scenes.js", "./play-gesture.js"]
]);

test("every child-facing entry script installs the play-surface gesture guard", () => {
  for (const [entry, specifier] of CHILD_ENTRIES) {
    const source = readFileSync(resolve(root, entry), "utf8");
    assert.match(source, new RegExp(`import \\{ protectPlaySurface \\} from "${specifier.replace(/\./g, "\\.")}"`), `${entry} does not import the guard`);
    assert.match(source, /(?<!function )protectPlaySurface\(\)/, `${entry} never calls protectPlaySurface`);
  }
});

test("the guard blocks Safari gesture events without passive listeners", () => {
  const source = readFileSync(resolve(root, "src/play-gesture.js"), "utf8");
  for (const name of ["gesturestart", "gesturechange", "gestureend"]) {
    assert.match(source, new RegExp(`"${name}"`), `guard ignores ${name}`);
  }
  assert.match(source, /preventDefault/);
  assert.match(source, /passive: false|passive:false/);
});

test("child-facing stylesheets reject scale and pan gestures", () => {
  for (const sheet of ["launcher.css", "styles.css", "color-splash.css", "peekaboo.css", "story-scenes.css"]) {
    const css = readFileSync(resolve(root, sheet), "utf8");
    assert.match(css, /touch-action:\s*none/, `${sheet} must set a touch-action: none policy`);
  }
  const caregiver = readFileSync(resolve(root, "caregiver.css"), "utf8");
  assert.doesNotMatch(caregiver, /touch-action:\s*none/, "caregiver page must stay zoomable");
  const caregiverScript = readFileSync(resolve(root, "src/caregiver.js"), "utf8");
  assert.equal(caregiverScript.includes("play-gesture"), false, "caregiver page must not install the child gesture guard");
});

test("Bloom's garden no longer invites pinch zoom", () => {
  const css = readFileSync(resolve(root, "styles.css"), "utf8");
  const garden = css.match(/\.garden\s*\{[^}]*\}/);
  assert.ok(garden);
  assert.doesNotMatch(garden[0], /pinch-zoom/);
  assert.match(garden[0], /touch-action:\s*none/);
});

test("the offline shell pre-caches the gesture guard", () => {
  const worker = readFileSync(resolve(root, "sw.js"), "utf8");
  assert.match(worker, /"\.\/src\/play-gesture\.js"/);
});
