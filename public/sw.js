
// Rota Salihli Service Worker
const CACHE_NAME = 'rota-salihli-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // PWA kriterleri için boş bir fetch dinleyicisi yeterlidir
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});
