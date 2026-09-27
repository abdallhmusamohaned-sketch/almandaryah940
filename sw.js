const CACHE_NAME = 'md-field-app-v1';
const ASSETS = ['./', './index.html', './manifest.json', './icon.png'];

self.addEventListener('install', (e)=>{
  e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)).catch(()=>{}));
  self.skipWaiting();
});

self.addEventListener('activate', (e)=>{ self.clients.claim(); });

self.addEventListener('fetch', (e)=>{
  if(e.request.method!=='GET') return;
  const url = new URL(e.request.url);
  if(url.origin !== location.origin) return; // لا نتدخل في طلبات جوجل درايف/الموقع
  e.respondWith(
    caches.match(e.request).then(cached=> cached || fetch(e.request).then(res=>{
      const resClone = res.clone();
      caches.open(CACHE_NAME).then(c=>c.put(e.request, resClone));
      return res;
    }).catch(()=>cached))
  );
});
