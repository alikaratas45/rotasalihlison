
// PWA Service Worker - Rota Salihli
// Tarayıcının uygulamayı "yüklenebilir" olarak görmesi için zorunlu olan fetch dinleyicisi eklenmiştir.

const CACHE_NAME = 'rota-salihli-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // PWA install prompt tetiklenmesi için bu blok zorunludur.
  // Gerekirse statik dosyaları burada cache'leyebilirsiniz.
});
