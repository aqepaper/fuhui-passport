// 福慧學習護照 Service Worker
const CACHE = 'fuhui-v1';
const PRECACHE = [
  '/fuhui-passport/',
  '/fuhui-passport/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(PRECACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // 只處理 GET，略過 GAS API 請求（避免干擾後端）
  if (e.request.method !== 'GET') return;
  if (e.request.url.includes('script.google.com')) return;

  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
