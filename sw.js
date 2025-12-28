// Service Worker pre Bruno's Calculator PWA
const CACHE_NAME = 'brunos-calculator-v5';
const FETCH_TIMEOUT = 5000; // 5 sekúnd timeout pre fetch requesty
const OFFLINE_PAGE = './offline.html';

const urlsToCache = [
  './',
  './index.html',
  './offline.html',
  './css/styles.css',
  './js/app.js',
  './js/modules/storage.js',
  './js/modules/ui.js',
  './js/modules/calculations.js',
  './js/modules/backup.js',
  './js/modules/persistence.js',
  './js/modules/constants.js',
  './js/modules/toast.js',
  './js/modules/indexeddb.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

/**
 * Fetch s timeoutom
 */
function fetchWithTimeout(request, timeout = FETCH_TIMEOUT) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error('Fetch timeout'));
    }, timeout);

    fetch(request)
      .then((response) => {
        clearTimeout(timeoutId);
        resolve(response);
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        reject(error);
      });
  });
}

// Inštalácia Service Workera
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('✅ Cache otvorený');
        // Cache súbory individuálne, aby jeden zlyhanie nespôsobilo celkové zlyhanie
        return Promise.allSettled(
          urlsToCache.map(url =>
            cache.add(url).catch(err => {
              console.warn(`⚠️ Nepodarilo sa cachovať ${url}:`, err);
              return null;
            })
          )
        ).then(() => {
          console.log('✅ Service Worker nainštalovaný');
        });
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

// Fetch stratégia: Network First s timeoutom, potom Cache, potom Offline stránka
self.addEventListener('fetch', (event) => {
  // Cache API podporuje iba GET requesty
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    fetchWithTimeout(event.request)
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
      .catch(async () => {
        // Ak fetch zlyhá alebo timeout, skúsiť cache
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }

        // Ak nie je v cache a je to navigačný request, zobraziť offline stránku
        if (event.request.mode === 'navigate') {
          const offlinePage = await caches.match(OFFLINE_PAGE);
          if (offlinePage) {
            return offlinePage;
          }
        }

        // Fallback pre ostatné requesty
        return new Response('Offline - obsah nie je dostupný', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: new Headers({ 'Content-Type': 'text/plain; charset=utf-8' })
        });
      })
  );
});
