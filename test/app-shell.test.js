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

test("the launcher exposes every available game and prototype", () => {
  const html = readFileSync(resolve(root, "index.html"), "utf8");
  const gameLinks = [...html.matchAll(/<a\s+class="game-card[^"]*"\s+href="([^"]+)"/g)]
    .map((match) => match[1]);
  assert.deepEqual(gameLinks, [
    "./games/bloom/",
    "./games/color-splash/",
    "./games/peekaboo/",
    "./games/stack-settle/",
    "./games/story-scenes/",
    "./games/together-tones/"
  ]);
});

test("Color Splash completion remains available to assistive technology", () => {
  const html = readFileSync(resolve(root, "games/color-splash/index.html"), "utf8");
  const celebration = html.match(/<div\s+id="celebration"[^>]*>/i)?.[0];
  assert.ok(celebration, "Color Splash has no completion message");
  assert.doesNotMatch(celebration, /aria-hidden="true"/i);
});

test("open-ended creations share non-destructive home and confirmed fresh-start controls", () => {
  for (const page of ["games/bloom/index.html", "games/stack-settle/index.html", "games/story-scenes/index.html"]) {
    const html = readFileSync(resolve(root, page), "utf8");
    assert.match(html, /<a\b[^>]+href="\.\.\/\.\.\/"[^>]+aria-label="All games"/i, `${page} has no non-destructive home control`);
    assert.match(html, /id="fresh-start"[^>]+aria-haspopup="dialog"/i, `${page} has no fresh-start control`);
    assert.match(html, /id="fresh-dialog"[^>]+role="alertdialog"[^>]+aria-modal="true"/i, `${page} has no modal confirmation`);
    assert.match(html, /id="fresh-cancel"[^>]*>Keep playing</i, `${page} cannot preserve the current creation`);
    assert.match(html, /id="fresh-confirm"[^>]*>Start fresh</i, `${page} cannot confirm clearing`);
  }
});

test("Color Splash reserves controls without state-dependent board dimensions", () => {
  const css = readFileSync(resolve(root, "color-splash.css"), "utf8");
  const runtime = readFileSync(resolve(root, "src/color-splash.js"), "utf8");
  assert.match(css, /\.board-shell\s*\{[^}]*grid-template-rows:\s*auto auto 72px/s);
  assert.equal([...css.matchAll(/grid-template-rows:\s*auto auto 72px/g)].length, 2);
  assert.doesNotMatch(css, /\.has-undo[^}]*--board-size/s);
  assert.doesNotMatch(css, /\.teaching-board\s*\{[^}]*--board-size/s);
  assert.match(css, /\.splash-prompt\s*\{[^}]*grid-row:\s*1/s);
  assert.match(css, /\.color-board\s*\{[^}]*grid-row:\s*2/s);
  assert.match(css, /\.undo-move\s*\{[^}]*grid-row:\s*3/s);
  assert.doesNotMatch(runtime, /has-undo/);
});
