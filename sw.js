const CACHE_NAME = 'pocketool-v17'; // Incrementa SEMPRE questo numero ad ogni modifica
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

// 1. Installazione e caching immediato
self.addEventListener('install', (e) => {
  self.skipWaiting(); // Forza il nuovo Service Worker a diventare attivo subito
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// 2. Cancellazione delle vecchie cache all'attivazione
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key); // Cancella la vecchia cache v16, v15, ecc.
          }
        })
      );
    }).then(() => self.clients.claim()) // Prende subito il controllo della pagina
  );
});

// 3. Risposta: prova la rete, se fallisce (offline) usa la cache
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
