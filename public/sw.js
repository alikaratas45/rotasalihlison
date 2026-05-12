
// Rota Salihli - PWA Service Worker
const CACHE_NAME = 'rota-salihli-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// Tarayıcıların "yüklenebilir" (installable) olarak görmesi için fetch dinleyicisi ŞARTTIR.
self.addEventListener('fetch', (event) => {
  // Standart ağ isteği stratejisi
  event.respondWith(fetch(event.request).catch(() => {
      // Çevrimdışı durum yönetimi buraya eklenebilir
  }));
});
