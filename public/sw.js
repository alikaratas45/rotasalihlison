
// PWA Service Worker
// Tarayıcıların uygulamayı "yüklenebilir" olarak tanıması için en az bir fetch event handler gereklidir.

const CACHE_NAME = 'rota-salihli-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Offline destek için temel strateji (istenirse geliştirilebilir)
  // Şimdilik boş bir fetch handler tarayıcı kriterleri için yeterlidir
});
