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
