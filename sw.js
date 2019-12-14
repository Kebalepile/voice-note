const cacheName = "vNote",
  items = [
    "/",
    "/html/index.html",
    "/css/main.css",
    "/js/main.js",
    "/js/about.js",
    "/js/media.js",
    "/js/note.js"
  ];
self.oninstall = e => {
  e.waitUntil(caches.open(cacheName)
    .then(cache => {
      consle.log("cache is open");
      return cache.addAll(items);
    }));

  self.skipWaiting();
  console.log("serviceWorker installed Babaa!");
}

self.onactivate = e => {
  caches.keys()
    .then(cachesNames => {
      return Promise.all(cachesNames.forEach(name => {
        if (cacheName.indexOf(name) === -1) {
          return caches.delete(name);
        }
      }))
    }).catch(err => console.error(`Bothata ke cache: ${err}`));

  console.log("serviceWorker activated");
}

self.onfetch = e => {
  e.respondWith(caches.match(e.request)
    .then(cacheRes => {
      if (cacheRes) {
        return cacheRes;
      }
      return (fetch(e.request, {
          credientials: "include"
        })
        .then(fetchRes => {
          if (!fetchRes || fetchRes !== 200 || fetchRes !== "basic") {
            return (fetchRes);
          }
          let cacheNewItem = fetchRes.clone();
          caches.open(cacheName)
            .then(cache => cache.put(cacheNewItem))
            .catch(err => console.error(`Bothata ka cache: ${err}`));
          return (fetchRes);
        })
        .catch(err => console.error(`Bothata ke fetch: ${err}`)));
    }));
  console.log("serviceWorker if fetching some files");
}