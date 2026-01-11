const CACHE_NAME = 'lifematrix-v3.6';
const ASSETS = ['./', './index.html', './manifest.json'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then(names => Promise.all(names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET' || !e.request.url.startsWith('http')) return;
  e.respondWith(fetch(e.request).then(r => { if (r.status === 200) { caches.open(CACHE_NAME).then(c => c.put(e.request, r.clone())); } return r; }).catch(() => caches.match(e.request).then(c => c || (e.request.mode === 'navigate' ? caches.match('./index.html') : new Response('Offline', { status: 503 })))));
});
