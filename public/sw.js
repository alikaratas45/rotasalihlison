// Rota Salihli PWA Service Worker
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // PWA kriterlerini karşılamak için gerekli fetch dinleyicisi
  event.respondWith(fetch(event.request));
});
