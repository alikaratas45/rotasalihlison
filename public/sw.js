
// Rota Salihli - PWA Service Worker
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Tarayıcının "yüklenebilir" (installable) sinyalini tetiklemesi için zorunlu fetch dinleyicisi
  event.respondWith(fetch(event.request));
});
