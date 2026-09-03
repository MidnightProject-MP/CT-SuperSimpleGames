import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import vm from "node:vm";

const workerSource = readFileSync(resolve(import.meta.dirname, "../sw.js"), "utf8");

function createWorkerHarness({ fetchResult, cached = new Map(), cacheWriteError, addFailureUrl } = {}) {
  const listeners = new Map();
  const writes = [];
  const adds = [];
  const cache = {
    add: async (url) => {
      adds.push(url);
      if (addFailureUrl && url === addFailureUrl) throw new Error(`mock add failure for ${url}`);
      // Simulate successful add by storing a mock response
      const full = new URL(url, "https://bloom.test/CT-SuperSimpleGames/sw.js").href;
      cached.set(full, { url: full, ok: true });
    },
    addAll: async () => {},
    put: async (request, response) => {
      if (cacheWriteError) throw cacheWriteError;
      const key = typeof request === "string" ? request : request.url;
      writes.push({ request, response, key });
      cached.set(key, response);
    }
  };
  const caches = {
    open: async () => cache,
    keys: async () => [],
    delete: async () => true,
    match: async (request) => {
      const key = typeof request === "string" ? request : request.url;
      // Direct match
      if (cached.has(key)) return cached.get(key);
      return undefined;
    }
  };
  const self = {
    location: { origin: "https://bloom.test", href: "https://bloom.test/CT-SuperSimpleGames/sw.js" },
    clients: { claim: async () => {} },
    skipWaiting: () => {},
    addEventListener: (name, listener) => listeners.set(name, listener)
  };

  vm.runInNewContext(workerSource, {
    self,
    caches,
    fetch: async (input) => {
      // input may be Request object or string url
      const url = typeof input === "string" ? input : input.url;
      if (fetchResult) return fetchResult(url);
      throw new Error("fetch not mocked");
    },
    URL,
    Response,
    Promise,
    console
  });

  return { listeners, writes, adds, cached, cache };
}

async function dispatchFetch(harness, request) {
  let responsePromise;
  let waitUntilPromise;
  const event = {
    request,
    respondWith: (promise) => { responsePromise = promise; },
    waitUntil: (promise) => { waitUntilPromise = promise; }
  };
  harness.listeners.get("fetch")(event);
  // For cache-first with background refresh, waitUntil may be used, but our new handler
  // uses fire-and-forget fetch without waitUntil for cached hits. So we just await response.
  return responsePromise;
}

async function dispatchInstall(harness) {
  let waitUntilPromise;
  harness.listeners.get("install")({
    waitUntil: (promise) => { waitUntilPromise = promise; }
  });
  return waitUntilPromise;
}

// --- Install robustness ---

test("install precaches individually and tolerates a single asset failure", async () => {
  const harness = createWorkerHarness({ addFailureUrl: "./src/game.js" });
  const promise = await dispatchInstall(harness);
  // Should not reject even though one add failed
  await promise;
  // All shell entries should have been attempted
  const shellBlock = workerSource.match(/const APP_SHELL = \[([\s\S]*?)\];/)[1];
  const expected = [...shellBlock.matchAll(/"([^"]+)"/g)].map((m) => m[1]);
  assert.equal(harness.adds.length, expected.length);
  assert.ok(harness.adds.includes("./src/game.js"));
  // Failed url should not be in cached map, others should
  assert.equal(harness.cached.has("https://bloom.test/CT-SuperSimpleGames/src/game.js"), false);
  assert.equal(harness.cached.has("https://bloom.test/CT-SuperSimpleGames/src/app.js"), true);
});

test("install uses per-entry add, not a single addAll that would brick on one failure", () => {
  assert.match(workerSource, /Promise\.allSettled/);
  assert.match(workerSource, /cache\.add\(/);
  assert.doesNotMatch(workerSource, /cache\.addAll\(APP_SHELL\)/);
});

// --- Cache-first shell ---

test("cached shell assets are served cache-first without waiting for network", async () => {
  const cachedResponse = { cached: true, ok: true };
  let fetchCalled = false;
  const harness = createWorkerHarness({
    fetchResult: () => {
      fetchCalled = true;
      return { ok: true, clone: () => ({}) };
    },
    cached: new Map([["https://bloom.test/CT-SuperSimpleGames/src/app.js", cachedResponse]])
  });
  const request = { method: "GET", mode: "cors", url: "https://bloom.test/CT-SuperSimpleGames/src/app.js" };
  const response = await dispatchFetch(harness, request);
  assert.equal(response, cachedResponse);
  // Background refresh is fire-and-forget; immediate writes may not have happened yet.
  // The critical assertion is that cached was returned, not network.
  assert.equal(fetchCalled, true); // background revalidation still happens
});

test("uncached same-origin assets are fetched, cached, and returned when online", async () => {
  const copy = { cached: true };
  const networkResponse = { ok: true, clone: () => copy };
  const harness = createWorkerHarness({ fetchResult: () => networkResponse });
  const request = { method: "GET", mode: "cors", url: "https://bloom.test/CT-SuperSimpleGames/src/app.js" };
  assert.equal(await dispatchFetch(harness, request), networkResponse);
  assert.equal(harness.writes.length, 1);
  assert.equal(harness.writes[0].key, request.url);
});

test("offline requests fall back to a matching cached asset", async () => {
  const request = { method: "GET", mode: "cors", url: "https://bloom.test/CT-SuperSimpleGames/styles.css" };
  const cachedResponse = { cached: true };
  const harness = createWorkerHarness({
    fetchResult: () => { throw new Error("offline"); },
    cached: new Map([[request.url, cachedResponse]])
  });
  assert.equal(await dispatchFetch(harness, request), cachedResponse);
});

test("a cache-write failure never hides a successful network response", async () => {
  const networkResponse = { ok: true, clone: () => ({ cached: true }) };
  const harness = createWorkerHarness({
    fetchResult: () => networkResponse,
    cacheWriteError: new Error("quota exceeded")
  });
  const request = { method: "GET", mode: "cors", url: "https://bloom.test/CT-SuperSimpleGames/src/app.js" };
  assert.equal(await dispatchFetch(harness, request), networkResponse);
});

test("offline navigation falls back to the cached root", async () => {
  const rootResponse = { shell: true };
  const harness = createWorkerHarness({
    fetchResult: () => { throw new Error("offline"); },
    cached: new Map([["https://bloom.test/CT-SuperSimpleGames/", rootResponse]])
  });
  const request = { method: "GET", mode: "navigate", url: "https://bloom.test/anything" };
  assert.equal(await dispatchFetch(harness, request), rootResponse);
});

test("offline navigation tries directory-index variants before root", async () => {
  const gameResponse = { game: true };
  const rootResponse = { shell: true };
  const harness = createWorkerHarness({
    fetchResult: () => { throw new Error("offline"); },
    cached: new Map([
      ["https://bloom.test/CT-SuperSimpleGames/games/bloom/", gameResponse],
      ["https://bloom.test/CT-SuperSimpleGames/", rootResponse]
    ])
  });
  // Request without trailing slash should still find the cached directory
  const request = { method: "GET", mode: "navigate", url: "https://bloom.test/CT-SuperSimpleGames/games/bloom" };
  assert.equal(await dispatchFetch(harness, request), gameResponse);
});

test("offline navigation for index.html variant is matched", async () => {
  const gameResponse = { game: true };
  const harness = createWorkerHarness({
    fetchResult: () => { throw new Error("offline"); },
    cached: new Map([["https://bloom.test/CT-SuperSimpleGames/games/memory/index.html", gameResponse]])
  });
  const request = { method: "GET", mode: "navigate", url: "https://bloom.test/CT-SuperSimpleGames/games/memory/" };
  assert.equal(await dispatchFetch(harness, request), gameResponse);
});

test("cross-origin requests are not intercepted", async () => {
  const harness = createWorkerHarness({
    fetchResult: () => { throw new Error("should not be called"); }
  });
  const request = { method: "GET", mode: "cors", url: "https://evil.test/steal.js" };
  const result = await dispatchFetch(harness, request);
  assert.equal(result, undefined);
});

test("service worker uses cache-first with background revalidation, not network-first", () => {
  // Network-first would be fetch().then(...).catch(...). Cache-first is caches.match before fetch.
  const fetchSection = workerSource.slice(workerSource.indexOf('self.addEventListener("fetch"'));
  const matchIndex = fetchSection.indexOf("caches.match");
  const fetchIndex = fetchSection.indexOf("fetch(event.request)");
  assert.ok(matchIndex !== -1 && fetchIndex !== -1, "both caches.match and fetch must appear");
  assert.ok(matchIndex < fetchIndex, "caches.match must precede fetch for cache-first strategy");
});
