const CACHE_NAME = 'lifematrix-v3.20';
const ASSETS = ['./', './index.html', './manifest.json'];

// 安装时缓存基础资源
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting()) // 立即激活新版本
  );
});

// 激活时清理旧缓存
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then(names => Promise.all(
        names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n))
      ))
      .then(() => self.clients.claim()) // 立即控制所有页面
  );
});

// 网络优先策略：总是尝试获取最新版本
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  if (!e.request.url.startsWith('http')) return;

  e.respondWith(
    fetch(e.request)
      .then(response => {
        // 网络请求成功，更新缓存
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(e.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // 网络失败，使用缓存
        return caches.match(e.request).then(cached => {
          if (cached) return cached;
          // 导航请求返回首页
          if (e.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
          return new Response('Offline', { status: 503 });
        });
      })
  );
});

// 监听来自页面的消息
self.addEventListener('message', (e) => {
  if (e.data === 'skipWaiting') {
    self.skipWaiting();
  }
});
