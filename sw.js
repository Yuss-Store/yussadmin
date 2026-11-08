const CACHE_NAME = 'yussxy-admin-v1';
const ASSETS = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './logo.jpg',
    './manifest.json'
];

self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(ASSETS).catch(function(err) {
                console.log('Cache gagal:', err);
            });
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', function(e) {
    e.waitUntil(
        caches.keys().then(function(keys) {
            return Promise.all(
                keys.filter(function(k) { return k !== CACHE_NAME; })
                    .map(function(k) { return caches.delete(k); })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', function(e) {
    if (e.request.method !== 'GET') return;

    var url = new URL(e.request.url);
    if (url.origin !== location.origin) return;

    e.respondWith(
        caches.match(e.request).then(function(cached) {
            if (cached) {
                fetch(e.request).then(function(res) {
                    if (res && res.status === 200) {
                        caches.open(CACHE_NAME).then(function(cache) {
                            cache.put(e.request, res.clone());
                        });
                    }
                }).catch(function() {});
                return cached;
            }

            return fetch(e.request).then(function(res) {
                if (res && res.status === 200) {
                    var resClone = res.clone();
                    caches.open(CACHE_NAME).then(function(cache) {
                        cache.put(e.request, resClone);
                    });
                }
                return res;
            }).catch(function() {
                return caches.match('./index.html');
            });
        })
    );
});