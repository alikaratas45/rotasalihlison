// Rota Salihli - PWA Service Worker
const CACHE_NAME = 'rota-salihli-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// A functional fetch handler is REQUIRED for a site to be considered "installable" (PWA)
self.addEventListener('fetch', (event) => {
  // We can implement caching strategies here in the future
  // For now, this exists to satisfy PWA criteria
});
