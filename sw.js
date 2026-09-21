const CACHE_NAME = "kantin-ibu-rezza-v2";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",

  "./LOGO-PREVIEW-KANTIN.jpg",

  "./RISOL-MAYO.jpg",
  "./BASO-GEMOY.jpg",
  "./SEBLAK..jpg",
  "./ANEKA-JAJANAN.jpg",
  "./ANEKA-GORENGAN.jpg",
  "./ANEKA-MINUMAN.jpg"
];

self.addEventListener("install", event => {

  event.waitUntil(

    caches.open(CACHE_NAME)
      .then(cache => {

        return cache.addAll(
          FILES_TO_CACHE
        );

      })

  );

  self.skipWaiting();
});


self.addEventListener("activate", event => {

  event.waitUntil(

    caches.keys()
      .then(keys => {

        return Promise.all(

          keys
            .filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))

        );

      })

  );

  self.clients.claim();
});


self.addEventListener("fetch", event => {

  if(event.request.method !== "GET"){
    return;
  }

  event.respondWith(

    caches.match(event.request)
      .then(cachedResponse => {

        if(cachedResponse){
          return cachedResponse;
        }

        return fetch(event.request)
          .then(networkResponse => {

            if(
              !networkResponse ||
              networkResponse.status !== 200 ||
              networkResponse.type === "opaque"
            ){
              return networkResponse;
            }

            const cloned =
              networkResponse.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(
                  event.request,
                  cloned
                );
              });

            return networkResponse;
          })
          .catch(() => {

            return caches.match(
              "./index.html"
            );

          });

      })

  );
});
