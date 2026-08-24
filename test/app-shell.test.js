import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const pages = [
  "index.html",
  "games/bloom/index.html",
  "games/color-splash/index.html",
  "games/peekaboo/index.html",
  "games/stack-settle/index.html",
  "games/story-scenes/index.html",
  "games/together-tones/index.html"
];

test("manifest icons exist at their declared sizes", () => {
  const manifest = JSON.parse(readFileSync(resolve(root, "manifest.webmanifest"), "utf8"));
  const declaredSizes = new Set(manifest.icons.map((icon) => icon.sizes));

  assert.ok(declaredSizes.has("192x192"));
  assert.ok(declaredSizes.has("512x512"));
  for (const icon of manifest.icons) {
    assert.ok(existsSync(resolve(root, icon.src.replace(/^\//, ""))), `${icon.src} is missing`);
  }
});

test("every pre-cached application-shell asset exists", () => {
  const worker = readFileSync(resolve(root, "sw.js"), "utf8");
  const shellBlock = worker.match(/const APP_SHELL = \[([\s\S]*?)\];/)?.[1];
  assert.ok(shellBlock, "APP_SHELL is missing");

  const paths = [...shellBlock.matchAll(/"([^"]+)"/g)].map((match) => match[1]);
  assert.ok(paths.length > 0);
  for (const path of paths) {
    const file = path === "./" ? "index.html" : path.replace(/^\.\//, "");
    assert.ok(existsSync(resolve(root, file)), `${path} is missing`);
  }
});

test("every app page uses only existing internal navigation and assets", () => {
  for (const page of pages) {
    const html = readFileSync(resolve(root, page), "utf8");
    const references = [...html.matchAll(/<(?:a|script|link)\b[^>]+(?:src|href)="([^"]+)"/g)]
      .map((match) => match[1]);

    assert.ok(references.length > 0, `${page} has no local references`);
    assert.equal(references.some((reference) => /^https?:\/\//.test(reference)), false, `${page} has an external reference`);
    for (const reference of references) {
      const target = resolve(root, page, "..", reference);
      assert.ok(existsSync(target), `${page} references missing ${reference}`);
    }
  }
});

test("every app page enforces the no-external-action boundary", () => {
  const expectedDirectives = new Map([
    ["default-src", ["'self'"]],
    ["base-uri", ["'none'"]],
    ["object-src", ["'none'"]],
    ["frame-src", ["'none'"]],
    ["form-action", ["'none'"]],
    ["connect-src", ["'self'"]],
    ["script-src", ["'self'"]],
    ["style-src", ["'self'", "'unsafe-inline'"]],
    ["img-src", ["'self'", "data:"]],
    ["media-src", ["'none'"]],
    ["worker-src", ["'self'"]],
    ["manifest-src", ["'self'"]]
  ]);

  for (const page of pages) {
    const html = readFileSync(resolve(root, page), "utf8");
    const policy = html.match(/<meta\s+http-equiv="Content-Security-Policy"\s+content="([^"]+)"/i)?.[1];
    assert.ok(policy, `${page} has no Content Security Policy`);
    const directives = new Map(policy.split(";").map((part) => {
      const [name, ...sources] = part.trim().split(/\s+/);
      return [name, sources];
    }).filter(([name]) => name));
    for (const [name, sources] of expectedDirectives) {
      assert.deepEqual(directives.get(name), sources, `${page} has an unsafe ${name} policy`);
    }
    assert.match(html, /<meta\s+name="referrer"\s+content="no-referrer"/i, `${page} can leak referrers`);
    assert.doesNotMatch(html, /<(?:form|iframe|object|embed)\b/i, `${page} contains an adult-consequence surface`);
  }
});

test("the launcher exposes exactly the active portfolio", () => {
  const html = readFileSync(resolve(root, "index.html"), "utf8");
  const gameLinks = [...html.matchAll(/<a\s+class="game-card[^"]*"\s+href="([^"]+)"/g)]
    .map((match) => match[1]);
  assert.deepEqual(gameLinks, [
    "./games/bloom/",
    "./games/color-splash/",
    "./games/peekaboo/",
    "./games/story-scenes/"
  ]);
});

test("retired worlds stay out of the launcher, offline shell, and caregiver settings", () => {
  const launcher = readFileSync(resolve(root, "index.html"), "utf8");
  assert.doesNotMatch(launcher, /data-world="(stack-settle|together-tones)"/);

  const worker = readFileSync(resolve(root, "sw.js"), "utf8");
  for (const retired of ["stack-settle", "together-tones", "src/stack", "src/together-tone"]) {
    assert.equal(worker.includes(retired), false, `${retired} must not be pre-cached`);
  }

  const settings = readFileSync(resolve(root, "src/caregiver-settings.js"), "utf8");
  assert.doesNotMatch(settings, /"(stack-settle|together-tones)"/);

  const caregiverPage = readFileSync(resolve(root, "caregiver.html"), "utf8");
  assert.doesNotMatch(caregiverPage, /value="(stack-settle|together-tones)"/);
});

test("Color Splash completion stays assistive, protected briefly, then restarts from ordinary input", () => {
  const html = readFileSync(resolve(root, "games/color-splash/index.html"), "utf8");
  assert.doesNotMatch(html, /id="celebration"|id="new-board"|id="undo-move"/i, "completion must not depend on special controls");
  const controller = readFileSync(resolve(root, "src/color-splash.js"), "utf8");
  assert.match(controller, /All squares filled\. Tap anywhere for a new board\./);
  assert.match(controller, /COMPLETION_HOLD_MS = 1500/, "completion must hold before input can dismiss it");
  assert.match(controller, /completedAt = performance\.now\(\)/);
  assert.match(controller, /- completedAt >= COMPLETION_HOLD_MS\) newRound\(/, "input after the hold must start the new board");
});

test("active worlds keep destructive resets behind the grown-ups surface", () => {
  for (const page of ["games/bloom/index.html", "games/story-scenes/index.html"]) {
    const html = readFileSync(resolve(root, page), "utf8");
    assert.match(html, /<a\b[^>]+href="\.\.\/\.\.\/"[^>]+aria-label="All games"/i, `${page} has no non-destructive home control`);
    assert.doesNotMatch(html, /id="fresh-start"/i, `${page} exposes a child-visible Fresh control`);
    assert.doesNotMatch(html, /id="fresh-dialog"/i, `${page} keeps a child-facing confirmation dialog`);
  }
  const caregiverPage = readFileSync(resolve(root, "caregiver.html"), "utf8");
  assert.match(caregiverPage, /id="clear-creations"/, "caregiver surface must own creation clearing");
  const caregiverScript = readFileSync(resolve(root, "src/caregiver.js"), "utf8");
  assert.match(caregiverScript, /\.creation/);
});

test("Story Scenes switches scenes directly from dock chips without an overlay", () => {
  const html = readFileSync(resolve(root, "games/story-scenes/index.html"), "utf8");
  assert.doesNotMatch(html, /background-picker|background-button/i, "management overlay must be gone");
  assert.match(html, /id="scene-chips"/);
  const controller = readFileSync(resolve(root, "src/story-scenes.js"), "utf8");
  assert.match(controller, /function renderSceneChips/);
  assert.match(controller, /function switchScene/);
  assert.match(controller, /renderSceneChips\(\)/);
});

test("Color Splash reserves a stable frame with no removed-control remnants", () => {
  const css = readFileSync(resolve(root, "color-splash.css"), "utf8");
  const runtime = readFileSync(resolve(root, "src/color-splash.js"), "utf8");
  assert.match(css, /\.board-shell\s*\{[^}]*grid-template-rows:\s*auto auto 72px/s);
  assert.equal([...css.matchAll(/grid-template-rows:\s*auto auto 72px/g)].length, 2);
  assert.doesNotMatch(css, /\.has-undo[^}]*--board-size/s);
  assert.doesNotMatch(css, /\.teaching-board\s*\{[^}]*--board-size/s);
  assert.match(css, /\.splash-prompt\s*\{[^}]*grid-row:\s*1/s);
  assert.match(css, /\.color-board\s*\{[^}]*grid-row:\s*2/s);
  assert.doesNotMatch(css, /undo-move|new-board/, "retired control styles must stay removed");
  assert.doesNotMatch(runtime, /has-undo/);
});
