import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");

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

test("the playable page loads no third-party scripts or styles", () => {
  const html = readFileSync(resolve(root, "index.html"), "utf8");
  const executableReferences = [...html.matchAll(/<(?:script|link)\b[^>]+(?:src|href)="([^"]+)"/g)]
    .map((match) => match[1]);

  assert.ok(executableReferences.length > 0);
  assert.equal(executableReferences.some((reference) => /^https?:\/\//.test(reference)), false);
});
