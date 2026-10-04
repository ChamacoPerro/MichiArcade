const CACHE_NAME = 'michicade-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './styles/arcade.css',
  './styles/ui.css',
  './styles/games.css',
  './js/sprites.js',
  './js/audio.js',
  './js/storage.js',
  './js/progression.js',
  './js/achievements.js',
  './js/quests.js',
  './js/ui.js',
  './js/main.js',
  './js/games/atrapa-gato.js',
  './js/games/memoria-michi.js',
  './js/games/alimenta-gato.js',
  './js/games/gato-ninja.js',
  './js/games/gato-corredor.js',
  './js/games/no-despiertes.js',
  './assets/icon-192.png',
  './assets/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    }).catch(() => caches.match('./index.html'))
  );
});
