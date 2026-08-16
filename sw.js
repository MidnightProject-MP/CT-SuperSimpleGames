const CACHE_NAME = "supersimplegames-v4";
const APP_SHELL = [
  "./",
  "./index.html",
  "./launcher.css",
  "./styles.css",
  "./color-splash.css",
  "./games/bloom/",
  "./games/bloom/index.html",
  "./games/color-splash/",
  "./games/color-splash/index.html",
  "./src/app.js",
  "./src/audio.js",
  "./src/color-splash.js",
  "./src/flood.js",
  "./src/game.js",
  "./src/interaction.js",
  "./src/launcher.js",
  "./src/settings.js",
  "./manifest.webmanifest",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./assets/icon.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
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

  event.respondWith(
    fetch(event.request)
      .then(async (response) => {
        if (response.ok && new URL(event.request.url).origin === self.location.origin) {
          const copy = response.clone();
          try {
            const cache = await caches.open(CACHE_NAME);
            await cache.put(event.request, copy);
          } catch {
            // A full or restricted cache must not break a successful network load.
          }
        }
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(event.request);
        if (cached) return cached;
        if (event.request.mode === "navigate") {
          return caches.match(new URL("./", self.location.href).href);
        }
        return Response.error();
      })
  );
});
