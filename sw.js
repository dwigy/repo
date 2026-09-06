// Offline-first service worker: precache the app shell, serve from cache,
// refresh in the background.
const VERSION = 'orbit-v8';
const ASSETS = [
  './', './index.html', './manifest.webmanifest', './css/style.css', './css/fonts.css',
  './fonts/Michroma-400.woff2', './fonts/BarlowCondensed-600.woff2', './fonts/BarlowCondensed-600i.woff2', './fonts/BarlowCondensed-800.woff2', './fonts/BarlowCondensed-800i.woff2',
  './js/app.js', './js/ui.js', './js/store.js', './js/game.js', './js/gtoons.js', './js/data.js', './js/art.js', './js/artwork.js', './js/pack.js', './js/sound.js', './js/news.js', './js/campaign.js', './js/story.js',
  './icons/icon.svg', './icons/icon-192.png', './icons/icon-512.png', './icons/icon-512-maskable.png', './icons/apple-touch-icon.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION && k !== VERSION + '-art').map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  // Artwork from Wikimedia Commons: cache-first so it works offline after the first look.
  if (url.hostname === 'upload.wikimedia.org') {
    e.respondWith(caches.open(VERSION + '-art').then(async (c) => {
      const hit = await c.match(e.request); if (hit) return hit;
      const res = await fetch(e.request); if (res && (res.ok || res.type === 'opaque')) c.put(e.request, res.clone()); return res;
    }).catch(() => fetch(e.request)));
    return;
  }
  if (url.hostname === 'en.wikipedia.org') return; // API calls go straight to the network
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((cached) => {
      const fetching = fetch(e.request).then((res) => {
        if (res && res.ok && new URL(e.request.url).origin === location.origin) {
          caches.open(VERSION).then((c) => c.put(e.request, res.clone()));
        }
        return res;
      }).catch(() => cached);
      return cached || fetching;
    })
  );
});
