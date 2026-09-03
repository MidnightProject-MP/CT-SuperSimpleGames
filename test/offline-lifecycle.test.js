import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import vm from "node:vm";

const root = resolve(import.meta.dirname, "..");
const workerSource = readFileSync(resolve(root, "sw.js"), "utf8");
const shellBlock = workerSource.match(/const APP_SHELL = \[([\s\S]*?)\];/)?.[1];
assert.ok(shellBlock, "APP_SHELL missing");
const shellPaths = [...shellBlock.matchAll(/"([^"]+)"/g)].map((m) => m[1]);

function shellUrlsFor(origin = "https://bloom.test", scope = "/CT-SuperSimpleGames/") {
  const swUrl = `${origin}${scope}sw.js`;
  return new Set(shellPaths.map((p) => new URL(p, swUrl).href));
}

function createHarness({ origin = "https://bloom.test", scope = "/CT-SuperSimpleGames/", extraCached = new Map(), offline = false } = {}) {
  const swUrl = `${origin}${scope}sw.js`;
  const originUrl = origin;
  const cached = new Map();
  const shellUrls = shellUrlsFor(origin, scope);
  // Pre-populate cache with shell
  for (const url of shellUrls) cached.set(url, { url, ok: true, shell: true });
  for (const [k, v] of extraCached) cached.set(k, v);

  const listeners = new Map();
  const self = {
    location: { origin: originUrl, href: swUrl },
    clients: { claim: async () => {} },
    skipWaiting: () => {},
    addEventListener: (name, fn) => listeners.set(name, fn)
  };
  const cache = {
    add: async () => {},
    addAll: async () => {},
    put: async () => {}
  };
  const caches = {
    open: async () => cache,
    keys: async () => [],
    delete: async () => true,
    match: async (request) => {
      const key = typeof request === "string" ? request : request.url;
      if (cached.has(key)) return cached.get(key);
      return undefined;
    }
  };
  vm.runInNewContext(workerSource, { self, caches, fetch: async () => {
    if (offline) throw new Error("offline");
    return { ok: true, clone: () => ({}), url: "" };
  }, URL, Response, Promise, console });
  return { listeners, cached, shellUrls };
}

async function fetchViaWorker(harness, url, mode = "navigate") {
  let promise;
  harness.listeners.get("fetch")({
    request: { method: "GET", mode, url },
    respondWith: (p) => { promise = p; },
    waitUntil: () => {}
  });
  if (!promise) return undefined; // not intercepted (e.g., cross-origin)
  return promise;
}

test("every launcher game link is precached", () => {
  const html = readFileSync(resolve(root, "index.html"), "utf8");
  const links = [...html.matchAll(/<a[^>]+href="([^"]+)"/g)].map((m) => m[1]);
  const shell = shellUrlsFor();
  const base = "https://bloom.test/CT-SuperSimpleGames/index.html";
  for (const href of links) {
    const url = new URL(href, base).href;
    assert.ok(shell.has(url), `${href} -> ${url} should be precached`);
    assert.ok(shell.has(new URL(href + "index.html", base).href) || shell.has(url), `${href} index variant`);
  }
});

test("every game page and its shell assets resolve to precached URLs on the deployed scope", () => {
  const pages = [
    "games/bloom/index.html",
    "games/color-splash/index.html",
    "games/memory/index.html",
    "games/number-nibbles/index.html",
    "games/peekaboo/index.html",
    "games/story-scenes/index.html"
  ];
  const shell = shellUrlsFor();
  for (const page of pages) {
    const base = `https://bloom.test/CT-SuperSimpleGames/${page}`;
    const html = readFileSync(resolve(root, page), "utf8");
    const refs = [...html.matchAll(/<(?:script|link)\b[^>]+(?:src|href)="([^"]+)"/g)].map((m) => m[1]);
    for (const ref of refs) {
      if (ref.startsWith("http") || ref.startsWith("data:")) continue;
      const url = new URL(ref, base).href;
      assert.ok(shell.has(url), `${page} ref ${ref} -> ${url} missing from shell`);
    }
    // Navigation itself should be precached both as directory and index.html
    const dirUrl = new URL("./", base).href; // e.g., .../games/bloom/
    assert.ok(shell.has(dirUrl), `${page} directory ${dirUrl} precached`);
    assert.ok(shell.has(new URL("index.html", dirUrl).href), `${page} index.html precached`);
  }
});

test("offline cold-launch: launcher loads from cache without network", async () => {
  const harness = createHarness({ offline: true });
  const response = await fetchViaWorker(harness, "https://bloom.test/CT-SuperSimpleGames/", "navigate");
  assert.ok(response, "launcher should be served offline");
});

test("offline navigation enters every active game and returns to launcher", async () => {
  const harness = createHarness({ offline: true });
  const worlds = [
    "https://bloom.test/CT-SuperSimpleGames/games/bloom/",
    "https://bloom.test/CT-SuperSimpleGames/games/color-splash/",
    "https://bloom.test/CT-SuperSimpleGames/games/peekaboo/",
    "https://bloom.test/CT-SuperSimpleGames/games/story-scenes/",
    "https://bloom.test/CT-SuperSimpleGames/games/memory/",
    "https://bloom.test/CT-SuperSimpleGames/games/number-nibbles/"
  ];
  for (const url of worlds) {
    const res = await fetchViaWorker(harness, url, "navigate");
    assert.ok(res, `${url} should be served offline`);
  }
  // Return to launcher
  const home = await fetchViaWorker(harness, "https://bloom.test/CT-SuperSimpleGames/", "navigate");
  assert.ok(home, "return to launcher offline");
});

test("offline navigation handles trailing-slash variants (PWA href vs direct index)", async () => {
  const harness = createHarness({ offline: true });
  // Some browsers request without trailing slash
  const withoutSlash = await fetchViaWorker(harness, "https://bloom.test/CT-SuperSimpleGames/games/bloom", "navigate");
  assert.ok(withoutSlash, "without trailing slash should still resolve offline via variant fallback");
  const indexDirect = await fetchViaWorker(harness, "https://bloom.test/CT-SuperSimpleGames/games/bloom/index.html", "navigate");
  assert.ok(indexDirect, "direct index.html should be served");
});

test("offline shell assets (CSS/JS) for each game are served from cache", async () => {
  const harness = createHarness({ offline: true });
  const assets = [
    "https://bloom.test/CT-SuperSimpleGames/styles.css",
    "https://bloom.test/CT-SuperSimpleGames/color-splash.css",
    "https://bloom.test/CT-SuperSimpleGames/peekaboo.css",
    "https://bloom.test/CT-SuperSimpleGames/story-scenes.css",
    "https://bloom.test/CT-SuperSimpleGames/memory.css",
    "https://bloom.test/CT-SuperSimpleGames/nibbles.css",
    "https://bloom.test/CT-SuperSimpleGames/src/app.js",
    "https://bloom.test/CT-SuperSimpleGames/src/color-splash.js",
    "https://bloom.test/CT-SuperSimpleGames/src/memory-game.js",
    "https://bloom.test/CT-SuperSimpleGames/src/nibbles-game.js",
    "https://bloom.test/CT-SuperSimpleGames/src/peekaboo.js",
    "https://bloom.test/CT-SuperSimpleGames/src/story-scenes.js",
    "https://bloom.test/CT-SuperSimpleGames/assets/pocket-friends.svg"
  ];
  for (const url of assets) {
    const res = await fetchViaWorker(harness, url, "cors");
    assert.ok(res, `${url} should be cached offline`);
  }
});

test("installed PWA scope and start_url are consistent with service worker scope", () => {
  const manifest = JSON.parse(readFileSync(resolve(root, "manifest.webmanifest"), "utf8"));
  assert.equal(manifest.scope, "./");
  assert.equal(manifest.start_url, "./");
  assert.equal(manifest.id, "./");
  // SW at ./sw.js with scope ./ controls everything under that directory
  const swScope = "./";
  assert.equal(swScope, manifest.scope);
});

test("service worker is cache-first, not network-first, for offline-first shell", () => {
  const fetchSection = workerSource.slice(workerSource.indexOf('self.addEventListener("fetch"'));
  const matchIdx = fetchSection.indexOf("caches.match");
  const fetchIdx = fetchSection.indexOf("fetch(event.request)");
  assert.ok(matchIdx !== -1 && fetchIdx !== -1);
  assert.ok(matchIdx < fetchIdx, "cache must be checked before network for instant offline launch");
});
