// Rota Salihli - PWA Service Worker
// Bu dosya tarayıcının uygulamayı "yüklenebilir" olarak tanıması için zorunludur.

const CACHE_NAME = 'rota-salihli-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// PWA kriterleri için fetch dinleyicisi zorunludur
self.addEventListener('fetch', (event) => {
  // Ağ isteklerini doğrudan geçir, ancak dinleyici mevcut olmalı.
});
