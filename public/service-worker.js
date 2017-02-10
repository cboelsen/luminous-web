'use strict';


function versionedNames(names, version) {
  const versionedNames = {};
  for (const name of names) {
    versionedNames[name] = name + `-v${version}`;
  }
  return versionedNames;
}


const CACHE_VERSION = 1;
const CACHE_NAMES = versionedNames([
  'offline'
], CACHE_VERSION);

const OFFLINE_URLS = [
  '/',
  '/favicon.ico',
  '/manifest.webmanifest',
  '/images/icon.svg',
  '/images/spinner.gif',
];
const ASSET_MANIFEST_URL = '/asset-manifest.json';


function filterSourceMaps(manifest) {
  return Object.keys(manifest).filter((k) => (! k.endsWith('.map'))).map((k) => manifest[k]);
}


self.addEventListener('install', (event) => {
  event.waitUntil(
    fetch(ASSET_MANIFEST_URL)
    .then((response) => response.json())
    .then((json) => {
      const staticAssets = filterSourceMaps(json);
      const urlsToCache = OFFLINE_URLS.concat(staticAssets);
      caches.open(CACHE_NAMES.offline)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      });
    })
  );
});


self.addEventListener('activate', (event) => {
  const expectedCacheNames = Object.keys(CACHE_NAMES).map((key) => CACHE_NAMES[key]);

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (expectedCacheNames.indexOf(cacheName) === -1) {
            console.log('Deleting out of date cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method === 'GET') {
    console.log('Handling fetch event for', event.request.url);
    event.respondWith(
      fetch(event.request).catch((error) => {
        console.log('Fetch failed; returning offline page instead.', error);
        return caches.match(event.request);
      })
    );
  }
});
