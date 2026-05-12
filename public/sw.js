
/**
 * Rota Salihli - Service Worker
 * Bu dosya, uygulamanın "yüklenebilir" (PWA) olarak tanınması için şarttır.
 * İçinde en az bir 'fetch' dinleyicisi olmalıdır.
 */

const CACHE_NAME = 'rota-salihli-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/logos.png',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// PWA kriteri için zorunlu fetch dinleyicisi
self.addEventListener('fetch', (event) => {
  // Statik dosyalar veya API istekleri için ağdan çekme stratejisi
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
