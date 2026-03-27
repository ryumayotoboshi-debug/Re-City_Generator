// キャッシュ名と対象ファイル
const CACHE_NAME = 'recity-generator-v1';
const FILES_TO_CACHE = [
  '/',                  // index.html
  '/index.html',
  '/data.js',
  '/IMG_6157.png',
  '/manifest.json?v=5'
];

// インストール時にキャッシュ
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// アクティベート時に古いキャッシュ削除
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => 
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

// フェッチ時にキャッシュ優先で返す
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(resp => resp || fetch(event.request))
      .catch(() => caches.match('/index.html')) // オフライン時は index.html を返す
  );
});