const CACHE_NAME = 'jocevs-static-v1';
const OFFLINE_URL = '/offline.html';
const PRECACHED_URLS = [OFFLINE_URL, '/icons/icon-192.png'];
const IMMUTABLE_PREFIXES = ['/_next/static/'];
const REVALIDATED_PREFIXES = ['/brand/', '/icons/'];

function startsWithAny(pathname, prefixes) {
  return prefixes.some((prefix) => pathname.startsWith(prefix));
}

async function storeCopy(request, response) {
  if (response.ok) {
    const cache = await caches.open(CACHE_NAME);
    await cache.put(request, response.clone());
  }
  return response;
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  return cached || storeCopy(request, await fetch(request));
}

async function staleWhileRevalidate(request) {
  const cached = await caches.match(request);
  const refreshed = fetch(request).then((response) => storeCopy(request, response));
  return cached || refreshed;
}

async function networkOrOfflinePage(request) {
  try {
    return await fetch(request);
  } catch {
    return caches.match(OFFLINE_URL);
  }
}

async function precache() {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(PRECACHED_URLS);
  await self.skipWaiting();
}

async function removeOldCaches() {
  const names = await caches.keys();
  await Promise.all(names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name)));
  await self.clients.claim();
}

function pickStrategy(request) {
  if (request.method !== 'GET') {
    return null;
  }
  if (request.mode === 'navigate') {
    return networkOrOfflinePage;
  }
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) {
    return null;
  }
  if (startsWithAny(url.pathname, IMMUTABLE_PREFIXES)) {
    return cacheFirst;
  }
  return startsWithAny(url.pathname, REVALIDATED_PREFIXES) ? staleWhileRevalidate : null;
}

self.addEventListener('install', (event) => event.waitUntil(precache()));
self.addEventListener('activate', (event) => event.waitUntil(removeOldCaches()));
self.addEventListener('fetch', (event) => {
  const strategy = pickStrategy(event.request);
  if (strategy) {
    event.respondWith(strategy(event.request));
  }
});
