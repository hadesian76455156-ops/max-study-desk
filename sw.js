// Service Worker for Max学习打卡台
// v2: 网络优先策略——总是先从网络拉最新代码，离线才用缓存，保证更新即时生效
const CACHE_NAME = 'max-study-desk-v2';
const urlsToCache = [
  './',
  './index.html',
  './app.js',
  './manifest.json'
];

self.addEventListener('install', function(event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  // 网络优先：先尝试网络，拿到最新响应后更新缓存；网络失败才读缓存
  event.respondWith(
    fetch(event.request)
      .then(function(response) {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        var responseToCache = response.clone();
        caches.open(CACHE_NAME)
          .then(function(cache) {
            cache.put(event.request, responseToCache);
          });
        return response;
      })
      .catch(function() {
        return caches.match(event.request);
      })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName !== CACHE_NAME;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});
