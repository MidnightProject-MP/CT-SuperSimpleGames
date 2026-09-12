#!/usr/bin/env node
// Rendered offline lifecycle probe: registration → ready/control → cached → offline cold navigation
// Usage: node scripts/verify-offline.mjs [--port 4173] [--headed]
// Requires: playwright-core + system Edge (msedge channel). Run `node scripts/dev-server.mjs` separately or let this start it.

import { chromium } from "playwright-core";
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";

const PORT = Number(process.env.PORT || 4173);
const BASE = `http://127.0.0.1:${PORT}`;
const WORLDS = [
  { path: "/", name: "launcher", check: `document.querySelector('.game-grid')` },
  { path: "/games/bloom/", name: "bloom", check: `document.querySelector('#garden')` },
  { path: "/games/color-splash/", name: "color-splash", check: `document.querySelector('#color-board')` },
  { path: "/games/peekaboo/", name: "peekaboo", check: `document.querySelector('#pocket-row')` },
  { path: "/games/story-scenes/", name: "story-scenes", check: `document.querySelector('#scene-stage')` },
  { path: "/games/memory/", name: "memory", check: `document.querySelector('#memory-board')` },
  { path: "/games/number-nibbles/", name: "numbers", check: `document.querySelector('#number-bubbles')` },
  { path: "/caregiver.html", name: "caregiver", check: `document.querySelector('.caregiver')` },
];

function startServer() {
  const proc = spawn(process.execPath, ["scripts/dev-server.mjs"], {
    env: { ...process.env, PORT: String(PORT) },
    stdio: ["ignore", "pipe", "pipe"]
  });
  return proc;
}

async function waitForServer(retries = 20) {
  for (let i = 0; i < retries; i += 1) {
    try {
      const res = await fetch(`${BASE}/`);
      if (res.ok) return;
    } catch {}
    await delay(300);
  }
  throw new Error(`dev server not ready at ${BASE}`);
}

async function main() {
  console.log(`[offline-probe] starting dev server at ${BASE}`);
  const server = startServer();
  server.stdout.on("data", (d) => process.stdout.write(d));
  server.stderr.on("data", (d) => process.stderr.write(d));

  let browser;
  try {
    await waitForServer();
    console.log("[offline-probe] launching Edge via playwright-core");
    browser = await chromium.launch({ channel: "msedge", headless: true });
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
    const page = await context.newPage();

    // 1. Online install: load launcher and wait for SW ready
    console.log("[offline-probe] 1/5 online load + SW registration");
    await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500); // let SW register on load event

    // Wait for SW to be ready and controlling
    const swState = await page.evaluate(async () => {
      if (!("serviceWorker" in navigator)) return { supported: false };
      const reg = await navigator.serviceWorker.ready;
      const controller = navigator.serviceWorker.controller;
      const keys = await caches.keys();
      // Check shell entries count
      let cachedCount = 0;
      if (keys.length) {
        const cache = await caches.open(keys[0]);
        const requests = await cache.keys();
        cachedCount = requests.length;
      }
      return {
        supported: true,
        scope: reg.scope,
        active: !!reg.active,
        controlling: !!controller,
        scriptURL: reg.active ? reg.active.scriptURL : null,
        cacheKeys: keys,
        cachedCount
      };
    });
    console.log("[offline-probe] SW state:", swState);
    if (!swState.supported) throw new Error("ServiceWorker not supported");
    if (!swState.active) throw new Error("ServiceWorker not active after online load");
    // Give a moment for install to finish caching
    await delay(2000);
    const afterInstall = await page.evaluate(async () => {
      const keys = await caches.keys();
      if (!keys.length) return { count: 0 };
      const cache = await caches.open(keys[0]);
      const reqs = await cache.keys();
      return { count: reqs.length, urls: reqs.map((r) => r.url).slice(0, 5) };
    });
    console.log("[offline-probe] after install cache count:", afterInstall.count);
    if (afterInstall.count < 40) {
      console.warn(`[offline-probe] WARNING: only ${afterInstall.count} cached, expected ~60`);
    }

    // 2. Go offline at browser context level
    console.log("[offline-probe] 2/5 going offline (context.setOffline)");
    await context.setOffline(true);

    // 3. Cold offline navigations: new page for each world to simulate cold launch
    console.log("[offline-probe] 3/5 offline cold navigations");
    for (const world of WORLDS) {
      const offlinePage = await context.newPage();
      const url = `${BASE}${world.path}`;
      console.log(`  → ${world.name} ${url} ...`);
      try {
        await offlinePage.goto(url, { waitUntil: "domcontentloaded", timeout: 5000 });
      } catch (e) {
        console.error(`  ✗ ${world.name} goto failed:`, e.message);
        await offlinePage.close();
        throw e;
      }
      // Check core element exists and is visible
      const ok = await offlinePage.evaluate((check) => {
        try { return !!eval(check); } catch { return false; }
      }, world.check);
      if (!ok) {
        const content = await offlinePage.content();
        console.error(`  ✗ ${world.name} core element missing, content snippet:`, content.slice(0, 500));
        await offlinePage.close();
        throw new Error(`${world.name} offline load failed: core element not found`);
      }
      console.log(`  ✓ ${world.name} offline ok`);
      await offlinePage.close();
    }

    // 4. Offline core interactions (tap)
    console.log("[offline-probe] 4/5 offline core interactions");
    // Bloom: tap garden should create a flower
    {
      const p = await context.newPage();
      await p.goto(`${BASE}/games/bloom/`, { waitUntil: "domcontentloaded" });
      const before = await p.evaluate(() => document.querySelectorAll(".bloom").length);
      await p.click("#playfield", { position: { x: 100, y: 100 } });
      await p.waitForTimeout(400);
      const after = await p.evaluate(() => document.querySelectorAll(".bloom").length);
      console.log(`  bloom: blooms ${before} -> ${after}`);
      if (after <= before) throw new Error("bloom offline interaction failed");
      await p.close();
    }
    // Color Splash: tap board
    {
      const p = await context.newPage();
      await p.goto(`${BASE}/games/color-splash/`, { waitUntil: "domcontentloaded" });
      await p.click("#color-board", { position: { x: 50, y: 50 } });
      await p.waitForTimeout(300);
      const cells = await p.evaluate(() => document.querySelectorAll(".color-cell").length);
      console.log(`  color-splash: cells ${cells}`);
      if (cells === 0) throw new Error("color-splash offline no cells");
      await p.close();
    }
    // Peekaboo: tap pocket
    {
      const p = await context.newPage();
      await p.goto(`${BASE}/games/peekaboo/`, { waitUntil: "domcontentloaded" });
      const pockets = await p.evaluate(() => document.querySelectorAll("#pocket-row button, .pocket-row button").length);
      console.log(`  peekaboo: pockets ${pockets}`);
      if (pockets === 0) throw new Error("peekaboo offline no pockets");
      await p.evaluate(() => document.querySelector("#pocket-row button")?.click());
      await p.waitForTimeout(300);
      await p.close();
    }
    // Memory: board has cards after witness
    {
      const p = await context.newPage();
      await p.goto(`${BASE}/games/memory/`, { waitUntil: "domcontentloaded" });
      await p.waitForTimeout(800);
      const cards = await p.evaluate(() => document.querySelectorAll(".memory-card").length);
      console.log(`  memory: cards ${cards}`);
      if (cards < 4) throw new Error("memory offline no cards");
      await p.close();
    }
    // Numbers: bubbles
    {
      const p = await context.newPage();
      await p.goto(`${BASE}/games/number-nibbles/`, { waitUntil: "domcontentloaded" });
      const bubbles = await p.evaluate(() => document.querySelectorAll(".number-bubble").length);
      console.log(`  numbers: bubbles ${bubbles}`);
      if (bubbles < 3) throw new Error("numbers offline no bubbles");
      await p.evaluate(() => document.querySelector(".number-bubble")?.click());
      await p.waitForTimeout(600);
      const friends = await p.evaluate(() => document.querySelectorAll(".scene-friend").length);
      console.log(`  numbers: friends after tap ${friends}`);
      if (friends === 0) throw new Error("numbers offline no friends after tap");
      await p.close();
    }

    // 5. Back online and verify update still works
    console.log("[offline-probe] 5/5 back online");
    await context.setOffline(false);
    const onlinePage = await context.newPage();
    await onlinePage.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
    console.log("  ✓ back online launcher loads");

    await browser.close();
    console.log("[offline-probe] ALL OFFLINE CHECKS PASSED");
  } catch (err) {
    console.error("[offline-probe] FAILED:", err);
    if (browser) await browser.close().catch(() => {});
    process.exitCode = 1;
  } finally {
    server.kill();
  }
}

main();
