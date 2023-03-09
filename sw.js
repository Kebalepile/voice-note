const cacheName = "LaterNoteTaker",
  items = [
    "/",
    "/index.html",
    "/main.css",
    "/main.js",
    "/components/info.js",
    "/components/note.js",
    "/components/notelist.js",
    "/components/TextnoteForm.js",
    "/components/VoicenoteForm.js",
    "/database/indexDB.js",
    "/utils/notification.js",
    "/utils/toggle.js",
    "/images/1.png",
    "/images/2.png",
    "/images/icons/txt.png",
    "/images/icons/mp3.png",
    "/images/icons/trash.svg",
  ];

self.addEventListener("install", (e) => {
  // console.log("service worker being installed");
  // perform install steps
  e.waitUntil(
    caches.open(cacheName).then((cache) => {
    //   console.log("cache is open");
      return cache.addAll(items);
    })
  );

  self.skipWaiting();
  // console.log("service worker installed");
});

self.addEventListener("activate", (e) => {
  caches.keys().then((cacheNames) => {
    return Promise.all(
      cacheNames.map((name) => {
        if (!cacheName.includes(name)) {
          return caches.delete(name);
        }
      })
    );
  });

  // console.log("service worker activated")
});

self.addEventListener("fetch", (e) => {
  // console.log("service worker is serving the asset.");
  e.respondWith(
    caches.match(e.request).then((res) => {
      if (res) {
        return res;
      }
      return fetch(e.request, {
        credentials: "include",
      })
        .then((netWorkResponse) => {
          if (
            !netWorkResponse ||
            netWorkResponse !== 200 ||
            netWorkResponse.type !== "basic"
          ) {
            return netWorkResponse;
          }
          let resToCache = netWorkResponse.clone();
          caches.open(cacheName).then((cache) => {
            cache.put(e.request, resToCache);
          });
          return netWorkResponse;
        })
        .catch((err) => {
          // console.error(err)
        });
    })
  );
});
