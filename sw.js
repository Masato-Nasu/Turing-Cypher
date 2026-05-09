const CACHE_NAME = 'turing-cypher-clean-text-1';
const ASSETS = [
  './?v=ap522-no-answer-url-1',
  './index.html?v=ap522-no-answer-url-1',
  './style.css?v=ap522-no-answer-url-1',
  './app.js?v=ap522-no-answer-url-1',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png'
];
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin === location.origin && (url.pathname.endsWith('/app.js') || url.pathname.endsWith('/style.css') || url.pathname.endsWith('/index.html') || url.pathname === '/')) {
    event.respondWith(fetch(event.request).then((response) => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
      return response;
    }).catch(() => caches.match(event.request)));
    return;
  }
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
});

