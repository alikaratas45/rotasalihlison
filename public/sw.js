
// Rota Salihli - Minimal Service Worker for PWA compliance
const CACHE_NAME = 'rota-salihli-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// Essential fetch listener for PWA installability criteria
self.addEventListener('fetch', (event) => {
  // We can implement caching strategies here if needed
  // For now, this is a pass-through to satisfy PWA requirements
});
