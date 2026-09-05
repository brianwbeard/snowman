const CACHE = 'snowman-v1.10';
const CORE = ['./','./index.html','./styles.css?v=1.10','./words.js?v=1.10','./app.js?v=1.10','./manifest.webmanifest?v=1.10','./icon-180.png?v=1.10','./icon-192.png','./icon-512.png','/learn-to-readle/answers.js'];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', event => { if (event.request.method !== 'GET') return; event.respondWith(fetch(event.request).then(response => { const copy=response.clone(); caches.open(CACHE).then(cache => cache.put(event.request,copy)); return response; }).catch(() => caches.match(event.request).then(r => r || caches.match('./index.html')))); });
