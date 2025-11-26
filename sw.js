// Service Worker pre Bruno's Calculator PWA
const CACHE_NAME = 'brunos-calculator-v2';
const urlsToCache = [
  './',
  './index.html',
  './css/styles.css',
  './js/app.js',
  './js/modules/storage.js',
  './js/modules/ui.js',
  './js/modules/calculations.js',
  './js/modules/backup.js',
  './js/modules/persistence.js',
  './js/modules/constants.js',
  './js/modules/toast.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Inštalácia Service Workera
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache otvorený');
        return cache.addAll(urlsToCache);
      })
  );
  // Aktivovať nový service worker okamžite
  self.skipWaiting();
});

// Aktivácia Service Workera
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Odstránenie starej cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Prevziať kontrolu nad všetkými klientmi okamžite
  return self.clients.claim();
});

// Fetch stratégia: Network First, potom Cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Ak je odpoveď OK, uložiť do cache
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Ak fetch zlyhá, skúsiť cache
        return caches.match(event.request);
      })
  );
});
