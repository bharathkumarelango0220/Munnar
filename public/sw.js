const CACHE_NAME = 'triptools-offline-v6';
const TILE_CACHE = 'triptools-tiles-v1';

const CORE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg',
  '/icon-192.png',
  '/icon-512.png'
];

// Install Event: Pre-cache core app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      try {
        await cache.addAll(CORE_ASSETS);
      } catch (err) {
        console.warn('[SW] Core assets pre-cache error:', err);
      }
    })
  );
  self.skipWaiting();
});

// Activate Event: Clean up outdated legacy caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key !== TILE_CACHE) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Offline-First with Robust Response Guarantees
self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // 1. Navigation / HTML Document Requests
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put('/index.html', copy));
          }
          return networkResponse;
        })
        .catch(async () => {
          const cache = await caches.open(CACHE_NAME);
          const cached = (await cache.match('/index.html')) || (await cache.match('/'));
          if (cached) return cached;
          return new Response(
            '<!DOCTYPE html><html><head><meta charset="utf-8"/><title>Offline</title></head><body style="font-family:sans-serif;padding:2rem;text-align:center;"><h2>You are offline</h2><p>Please reconnect to the internet to load fresh data.</p></body></html>',
            { headers: { 'Content-Type': 'text/html' } }
          );
        })
    );
    return;
  }

  // 2. Map Tile Requests
  if (url.hostname.includes('cartocdn.com') || url.hostname.includes('openstreetmap.org') || url.hostname.includes('arcgisonline.com')) {
    event.respondWith(
      caches.open(TILE_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        try {
          const networkRes = await fetch(request);
          if (networkRes && (networkRes.status === 200 || networkRes.type === 'opaque')) {
            cache.put(request, networkRes.clone());
          }
          return networkRes;
        } catch (e) {
          return new Response('', { status: 408, statusText: 'Tile Offline' });
        }
      })
    );
    return;
  }

  // 3. Static Assets (JS Chunks, CSS, Fonts, Images)
  event.respondWith(
    caches.match(request).then(async (cachedResponse) => {
      if (cachedResponse) {
        // Return from cache immediately, update in background if online
        fetch(request)
          .then((networkResponse) => {
            if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
              caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
            }
          })
          .catch(() => {});
        return cachedResponse;
      }

      // Fetch from network and save to cache
      try {
        const networkResponse = await fetch(request);
        if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
          const copy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return networkResponse;
      } catch (err) {
        // Fallback for missing offline assets
        return new Response('', { status: 503, statusText: 'Asset Offline' });
      }
    })
  );
});
