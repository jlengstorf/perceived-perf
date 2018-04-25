const CACHE_VERSION = 'perceived-perf-v1';
const OFFLINE_PAGE = './offline.html';

self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then(cache =>
        cache.addAll(['./lazyload.html', './skeleton.html', OFFLINE_PAGE])
      )
  );
});

self.addEventListener('fetch', event => {
  const fetchAndCache = request =>
    caches.open(CACHE_VERSION).then(cache =>
      // Load the response from the network.
      fetch(request).then(response => {
        // Add the response to the cache.
        cache.put(request, response.clone());
        return response;
      })
    );

  event.respondWith(
    caches
      // Check for cached data.
      .match(event.request)
      // Return the cached data OR hit the network.
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
