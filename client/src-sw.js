const { offlineFallback, warmStrategyCache } = require("workbox-recipes");
const { CacheFirst, StaleWhileRevalidate } = require("workbox-strategies");
const { registerRoute } = require("workbox-routing");
const { CacheableResponsePlugin } = require("workbox-cacheable-response");
const { ExpirationPlugin } = require("workbox-expiration");
const { precacheAndRoute } = require("workbox-precaching/precacheAndRoute");
// let the PWA to work offline
precacheAndRoute(self.__WB_MANIFEST);
// cache startegy
const pageCache = new CacheFirst({
  // create instance
  cacheName: "page-cache",
  plugins: [
    // plugin for cache functionality
    new CacheableResponsePlugin({
      // response statuses
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      // sets expiration time on cache (for how long it stored)
      maxAgeSeconds: 30 * 24 * 60 * 60, // equal to 30 days
    }),
  ],
});

warmStrategyCache({
  urls: ["/index.html", "/"],
  strategy: pageCache,
});
// registering app with work box
registerRoute(({ request }) => request.mode === "navigate", pageCache);

// Implement asset caching
// (style, script, worker
// staleWhile revalidate)
registerRoute(
  ({ request }) => ["style", "script", "worker"].includes(request.destination),
  new StaleWhileRevalidate({
    cacheName: "asset-cache",
    plugins: [
      new CacheableResponsePlugin({
        // response statuses
        statuses: [0, 200],
      }),
    ],
  })
);
