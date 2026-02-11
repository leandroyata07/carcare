const CACHE_VERSION = 'v2.2.3'; // AUMENTE ESTE NÚMERO A CADA ATUALIZAÇÃO
const CACHE_NAME = `carcare-${CACHE_VERSION}`;
const STATIC_CACHE = `carcare-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `carcare-dynamic-${CACHE_VERSION}`;

// Assets to cache on install
const STATIC_ASSETS = [
  '/carcare/',
  '/carcare/manifest.json',
  '/carcare/icon-192.png',
  '/carcare/icon-512.png'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing version:', CACHE_VERSION);
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[ServiceWorker] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[ServiceWorker] Skip waiting - force activation');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activating version:', CACHE_VERSION);
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              // Remove all old carcare caches
              return cacheName.startsWith('carcare-') && 
                     cacheName !== STATIC_CACHE && 
                     cacheName !== DYNAMIC_CACHE;
            })
            .map((cacheName) => {
              console.log('[ServiceWorker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('[ServiceWorker] Claiming clients immediately');
        return self.clients.claim();
      })
      .then(() => {
        // Força reload em todos os clientes abertos
        console.log('[ServiceWorker] Forcing reload on all clients');
        return self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
          clients.forEach(client => {
            console.log('[ServiceWorker] Sending FORCE_RELOAD to client');
            client.postMessage({
              type: 'FORCE_RELOAD',
              version: CACHE_VERSION,
              reason: 'sw_updated'
            });
          });
        });
      })
  );
});

// Fetch event - Network First strategy para HTML/JS, Cache First para assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome extensions and non-http(s) requests
  if (!request.url.startsWith('http')) {
    return;
  }

  const url = new URL(request.url);
  
  // Network First para HTML, JS, e JSON (sempre busca versão mais recente)
  if (
    request.url.includes('.html') || 
    request.url.includes('.js') || 
    request.url.includes('.json') ||
    request.url.endsWith('/carcare/') ||
    request.url.endsWith('/carcare')
  ) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          // Cache a nova versão
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Se offline, tenta buscar do cache
          return caches.match(request).then((cachedResponse) => {
            return cachedResponse || caches.match('/carcare/');
          });
        })
    );
    return;
  }

  // Cache First para imagens e assets estáticos
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request)
          .then((networkResponse) => {
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'error') {
              return networkResponse;
            }

            const responseToCache = networkResponse.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseToCache);
            });

            return networkResponse;
          })
          .catch(() => {
            return caches.match('/carcare/');
          });
      })
  );
});

// Background sync for offline data
self.addEventListener('sync', (event) => {
  console.log('[ServiceWorker] Background sync:', event.tag);
  
  if (event.tag === 'sync-data') {
    event.waitUntil(
      Promise.resolve()
    );
  }
});

// Message handler para comandos do cliente
self.addEventListener('message', (event) => {
  console.log('[ServiceWorker] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName.startsWith('carcare-')) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
  }
});

// Push notifications (if needed in the future)
self.addEventListener('push', (event) => {
  console.log('[ServiceWorker] Push received');
  
  const options = {
    body: event.data ? event.data.text() : 'Nova notificação do CarCare',
    icon: '/icon-192.svg',
    badge: '/icon-192.svg',
    vibrate: [200, 100, 200]
  };

  event.waitUntil(
    self.registration.showNotification('CarCare', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('[ServiceWorker] Notification clicked');
  
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});
