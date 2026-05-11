
// This is a minimal Service Worker required for PWA installability.
// Modern browsers require a fetch event listener to consider the app installable.

const CACHE_NAME = 'rota-salihli-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Required for PWA criteria. 
  // We can implement actual caching strategies here if needed.
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});
