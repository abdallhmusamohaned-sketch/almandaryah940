const CACHE_NAME = 'md-field-app-v2';
const ASSETS = ['./', './index.html', './manifest.json', './icon.png'];

self.addEventListener('install', (e)=>{
  e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)).catch(()=>{}));
  self.skipWaiting();
});

self.addEventListener('activate', (e)=>{
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k))))
  );
  self.clients.claim();
});

// شبكة أولاً ثم كاش احتياطي: يضمن وصول آخر تحديث دائمًا عند توفر إنترنت
self.addEventListener('fetch', (e)=>{
  if(e.request.method!=='GET') return;
  const url = new URL(e.request.url);
  if(url.origin !== location.origin) return; // لا نتدخل في طلبات جوجل درايف/الموقع
  e.respondWith(
    fetch(e.request).then(res=>{
      const resClone = res.clone();
      caches.open(CACHE_NAME).then(c=>c.put(e.request, resClone));
      return res;
    }).catch(()=> caches.match(e.request))
  );
});
