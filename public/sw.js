
// Rota Salihli - PWA Service Worker
const CACHE_NAME = 'rota-salihli-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/offline',
  '/logos.png',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Sadece GET isteklerini işle
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.match(event.request).then((response) => {
          if (response) {
            return response;
          }
          // Eğer ana sayfa isteniyorsa ve internet yoksa offline sayfasını veya önbelleği göster
          if (event.request.mode === 'navigate') {
            return caches.match('/');
          }
        });
      })
  );
});
