const CACHE_VERSION = 'perceived-perf-v1';
const OFFLINE_PAGE = './offline.html';

self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then(cache =>
        cache.addAll([
          './index.html',
          './lazyload.html',
          './skeleton.html',
          OFFLINE_PAGE
        ])
      )
  );
});

const fetchAndCache = request =>
  caches.open(CACHE_VERSION).then(cache =>
    fetch(request).then(response => {
      cache.put(request, response.clone());
      return response;
    })
  );

self.addEventListener('fetch', event => {
  event.respondWith(
    caches
      // Check for cached data.
      .match(event.request)
      // If cached data is found, return it; otherwise fetch as usual.
      .then(data => data || fetchAndCache(event.request))
      .catch(() => {
        const url = new URL(event.request.url);

        // Show the offline page for failed page requests.
        if (url.pathname.match(/\.html$/)) {
          return caches.match(OFFLINE_PAGE);
        }
      })
  );
});
