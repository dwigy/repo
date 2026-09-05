// Offline-first service worker: precache the app shell, serve from cache,
// refresh in the background.
const VERSION = 'orbit-v2';
const ASSETS = [
  './', './index.html', './manifest.webmanifest', './css/style.css', './css/fonts.css',
  './fonts/Michroma-400.woff2', './fonts/BarlowCondensed-600.woff2', './fonts/BarlowCondensed-600i.woff2', './fonts/BarlowCondensed-800.woff2', './fonts/BarlowCondensed-800i.woff2',
  './js/app.js', './js/ui.js', './js/store.js', './js/game.js', './js/gtoons.js', './js/data.js', './js/art.js',
  './icons/icon.svg', './icons/icon-192.png', './icons/icon-512.png', './icons/icon-512-maskable.png', './icons/apple-touch-icon.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
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
