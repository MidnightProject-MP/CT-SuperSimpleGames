const CACHE_NAME = "supersimplegames-v45";
const APP_SHELL = [
  "./",
  "./index.html",
  "./caregiver.html",
  "./caregiver.css",
  "./launcher.css",
  "./styles.css",
  "./fresh-start.css",
  "./color-splash.css",
  "./peekaboo.css",
  "./story-scenes.css",
  "./wind-down.css",
  "./games/bloom/",
  "./games/bloom/index.html",
  "./games/color-splash/",
  "./games/color-splash/index.html",
  "./games/peekaboo/",
  "./games/peekaboo/index.html",
  "./games/story-scenes/",
  "./games/story-scenes/index.html",
  "./src/app.js",
  "./src/audio.js",
  "./src/caregiver-settings.js",
  "./src/caregiver.js",
  "./src/color-input.js",
  "./src/color-splash.js",
  "./src/flood.js",
  "./src/fresh-start.js",
  "./src/game.js",
  "./src/interaction.js",
  "./src/local-state.js",
  "./src/launcher.js",
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
