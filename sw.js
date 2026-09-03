const CACHE_NAME = "supersimplegames-v51";
const APP_SHELL = [
  "./",
  "./index.html",
  "./caregiver.html",
  "./caregiver.css",
  "./launcher.css",
  "./styles.css",
  "./color-splash.css",
  "./peekaboo.css",
  "./story-scenes.css",
  "./memory.css",
  "./nibbles.css",
  "./wind-down.css",
  "./games/bloom/",
  "./games/bloom/index.html",
  "./games/color-splash/",
  "./games/color-splash/index.html",
  "./games/peekaboo/",
  "./games/peekaboo/index.html",
  "./games/story-scenes/",
  "./games/story-scenes/index.html",
  "./games/memory/",
  "./games/memory/index.html",
  "./games/number-nibbles/",
  "./games/number-nibbles/index.html",
  "./src/app.js",
  "./src/audio.js",
  "./src/caregiver-settings.js",
  "./src/caregiver.js",
  "./src/color-input.js",
  "./src/color-splash.js",
  "./src/flood.js",
  "./src/game.js",
  "./src/interaction.js",
  "./src/local-state.js",
  "./src/launcher.js",
  "./src/memory-adaptive.js",
  "./src/memory-core.js",
  "./src/memory-game.js",
  "./src/nibbles-core.js",
  "./src/nibbles-game.js",
  "./src/peekaboo.js",
  "./src/peekaboo-search.js",
  "./src/peekaboo-scenes.js",
  "./src/pocket-items.js",
  "./src/play-gesture.js",
  "./src/pockets.js",
  "./src/residents.js",
  "./src/settings.js",
  "./src/splash-boards.js",
  "./src/story-scene.js",
  "./src/story-packs.js",
  "./src/story-scenes.js",
  "./src/story-world.js",
  "./src/wind-down.js",
  "./manifest.webmanifest",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./assets/icon.svg",
  "./assets/icon-maskable.svg",
  "./assets/icon-maskable-192.png",
  "./assets/icon-maskable-512.png",
  "./assets/pocket-friends.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Single addAll() rejects if any one of ~60 fetches fails — one transient
      // 404 or deployment skew would brick the entire offline shell. Cache each
      // entry individually and let the install succeed with a partial shell;
      // missing assets will be cached on demand when the user is online.
      const results = await Promise.allSettled(APP_SHELL.map((url) => cache.add(url)));
      const failures = results.filter((r) => r.status === "rejected");
      if (failures.length) {
        // Install still promotes; the worker will fill gaps opportunistically.
        // Logged for diagnostics, not treated as install failure.
      }
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  if (new URL(event.request.url).origin !== self.location.origin) return;

  event.respondWith(
    (async () => {
      // Offline-first shell: cache-first, with stale-while-revalidate when cached.
      const cached = await caches.match(event.request);
      if (cached) {
        // Refresh in background without blocking the instant offline response.
        fetch(event.request)
          .then(async (response) => {
            if (response && response.ok) {
              try {
                const cache = await caches.open(CACHE_NAME);
                await cache.put(event.request, response);
              } catch {
                // Cache write failures must not break the response.
              }
            }
          })
          .catch(() => {});
        return cached;
      }

      try {
        const response = await fetch(event.request);
        if (response && response.ok) {
          try {
            const cache = await caches.open(CACHE_NAME);
            await cache.put(event.request, response.clone());
          } catch {
            // A full or restricted cache must not hide a successful load.
          }
        }
        return response;
      } catch {
        if (event.request.mode === "navigate") {
          // Navigation fallback: try common variants before returning the root shell.
          // Handles trailing-slash, index.html, and scope-relative differences that
          // still represent the same precached world.
          const url = new URL(event.request.url);
          const candidates = [];
          if (!url.pathname.endsWith("/")) {
            candidates.push(`${url.pathname}/`);
            candidates.push(`${url.pathname}/index.html`);
          } else {
            candidates.push(`${url.pathname}index.html`);
          }
          for (const path of candidates) {
            const candidateUrl = new URL(path, url.origin).href;
            const match = await caches.match(candidateUrl);
            if (match) return match;
          }
          const root = new URL("./", self.location.href).href;
          const fallback = await caches.match(root);
          if (fallback) return fallback;
          const rootIndex = new URL("./index.html", self.location.href).href;
          const fallbackIndex = await caches.match(rootIndex);
          if (fallbackIndex) return fallbackIndex;
        }
        return Response.error();
      }
    })()
  );
});
