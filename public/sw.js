
// Rota Salihli - PWA Service Worker
const CACHE_NAME = 'rota-salihli-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // PWA yüklenebilirliği için en az bir fetch listener zorunludur
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
