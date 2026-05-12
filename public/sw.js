// Service Worker for PWA compliance
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Simple fetch handler required for PWA installability
  event.respondWith(fetch(event.request).catch(() => {
    return caches.match(event.request);
  }));
});
