const CACHE_NAME = 'segurel-scan-mobile-free-v1';
const ASSETS = [
  './',
  './index_mobile_camera_free.html',
  './manifest_free.webmanifest',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;
  event.respondWith(caches.match(request).then(cached => cached || fetch(request).then(response => {
    const clone = response.clone();
    if (request.url.startsWith(self.location.origin)) {
      caches.open(CACHE_NAME).then(cache => cache.put(request, clone)).catch(() => {});
    }
    return response;
  }).catch(() => caches.match('./index_mobile_camera_free.html'))));
});
