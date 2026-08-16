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

test("Color Splash completion remains available to assistive technology", () => {
  const html = readFileSync(resolve(root, "games/color-splash/index.html"), "utf8");
  const celebration = html.match(/<div\s+id="celebration"[^>]*>/i)?.[0];
  assert.ok(celebration, "Color Splash has no completion message");
  assert.doesNotMatch(celebration, /aria-hidden="true"/i);
});
