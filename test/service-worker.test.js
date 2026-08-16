import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import vm from "node:vm";

const workerSource = readFileSync(resolve(import.meta.dirname, "../sw.js"), "utf8");

function createWorkerHarness({ fetchResult, cached = new Map(), cacheWriteError } = {}) {
  const listeners = new Map();
  const writes = [];
  const cache = {
    addAll: async () => {},
    put: async (request, response) => {
      if (cacheWriteError) throw cacheWriteError;
      writes.push({ request, response });
    }
  };
  const caches = {
    open: async () => cache,
    keys: async () => [],
    delete: async () => true,
    match: async (request) => cached.get(typeof request === "string" ? request : request.url)
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
    fetch: async () => fetchResult(),
    URL,
    Response
  });

  return { listeners, writes };
}

async function dispatchFetch(harness, request) {
  let responsePromise;
  harness.listeners.get("fetch")({
    request,
    respondWith: (promise) => { responsePromise = promise; }
  });
  return responsePromise;
}

test("online requests return and refresh same-origin assets", async () => {
  const copy = { cached: true };
  const networkResponse = { ok: true, clone: () => copy };
  const harness = createWorkerHarness({ fetchResult: () => networkResponse });
  const request = { method: "GET", mode: "cors", url: "https://bloom.test/src/app.js" };

  assert.equal(await dispatchFetch(harness, request), networkResponse);
  assert.equal(harness.writes.length, 1);
  assert.equal(harness.writes[0].request, request);
  assert.equal(harness.writes[0].response, copy);
});

test("offline requests fall back to a matching cached asset", async () => {
  const request = { method: "GET", mode: "cors", url: "https://bloom.test/styles.css" };
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
  const request = { method: "GET", mode: "cors", url: "https://bloom.test/src/app.js" };

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
