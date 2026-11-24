/* EmotiPET service worker: funciona offline depois da primeira visita. */
const VERSION = 'emotipet-v2';
const FONTS = 'emotipet-fonts-v1';
const CORE = [
"./",
"index.html",
"manifest.webmanifest",
"icons/icon-192.png",
"icons/icon-512.png",
"icons/maskable-512.png",
"icons/apple-touch-icon.png",
"faces/1f47f.webp",
"faces/1f600.webp",
"faces/1f601.webp",
"faces/1f602.webp",
"faces/1f603.webp",
"faces/1f604.webp",
"faces/1f605.webp",
"faces/1f606.webp",
"faces/1f607.webp",
"faces/1f608.webp",
"faces/1f609.webp",
"faces/1f60a.webp",
"faces/1f60b.webp",
"faces/1f60c.webp",
"faces/1f60e.webp",
"faces/1f60f.webp",
"faces/1f610.webp",
"faces/1f611.webp",
"faces/1f612.webp",
"faces/1f613.webp",
"faces/1f614.webp",
"faces/1f615.webp",
"faces/1f616.webp",
"faces/1f617.webp",
"faces/1f618.webp",
"faces/1f619.webp",
"faces/1f61a.webp",
"faces/1f61b.webp",
"faces/1f61c.webp",
"faces/1f61d.webp",
"faces/1f61e.webp",
"faces/1f61f.webp",
"faces/1f620.webp",
"faces/1f621.webp",
"faces/1f622.webp",
"faces/1f623.webp",
"faces/1f624.webp",
"faces/1f625.webp",
"faces/1f626.webp",
"faces/1f627.webp",
"faces/1f628.webp",
"faces/1f629.webp",
"faces/1f62a.webp",
"faces/1f62b.webp",
"faces/1f62c.webp",
"faces/1f62d.webp",
"faces/1f62e.webp",
"faces/1f62e_200d_1f4a8.webp",
"faces/1f62f.webp",
"faces/1f630.webp",
"faces/1f631.webp",
"faces/1f632.webp",
"faces/1f633.webp",
"faces/1f634.webp",
"faces/1f635.webp",
"faces/1f635_200d_1f4ab.webp",
"faces/1f636.webp",
"faces/1f636_200d_1f32b.webp",
"faces/1f637.webp",
"faces/1f641.webp",
"faces/1f642.webp",
"faces/1f642_200d_2194.webp",
"faces/1f642_200d_2195.webp",
"faces/1f643.webp",
"faces/1f644.webp",
"faces/1f910.webp",
"faces/1f911.webp",
"faces/1f912.webp",
"faces/1f913.webp",
"faces/1f914.webp",
"faces/1f915.webp",
"faces/1f917.webp",
"faces/1f920.webp",
"faces/1f921.webp",
"faces/1f922.webp",
"faces/1f923.webp",
"faces/1f924.webp",
"faces/1f925.webp",
"faces/1f927.webp",
"faces/1f928.webp",
"faces/1f929.webp",
"faces/1f92a.webp",
"faces/1f92b.webp",
"faces/1f92c.webp",
"faces/1f92d.webp",
"faces/1f92e.webp",
"faces/1f92f.webp",
"faces/1f970.webp",
"faces/1f971.webp",
"faces/1f972.webp",
"faces/1f973.webp",
"faces/1f974.webp",
"faces/1f975.webp",
"faces/1f976.webp",
"faces/1f978.webp",
"faces/1f979.webp",
"faces/1f97a.webp",
"faces/1f9d0.webp",
"faces/1fae0.webp",
"faces/1fae1.webp",
"faces/1fae2.webp",
"faces/1fae3.webp",
"faces/1fae4.webp",
"faces/1fae5.webp",
"faces/1fae8.webp",
"faces/1fae9.webp",
"faces/1faea.webp",
"faces/2639.webp",
"faces/263a.webp"
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION && k !== FONTS).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === location.origin) {
    // páginas: tenta a rede e cai para o cache; arquivos estáticos: cache primeiro
    if (req.mode === 'navigate') {
      e.respondWith(fetch(req).then(r => { const cp = r.clone(); caches.open(VERSION).then(c => c.put('index.html', cp)); return r; }).catch(() => caches.match('index.html')));
      return;
    }
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => { const cp = r.clone(); caches.open(VERSION).then(c => c.put(req, cp)); return r; })));
    return;
  }
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(caches.open(FONTS).then(c => c.match(req).then(hit => {
      const net = fetch(req).then(r => { c.put(req, r.clone()); return r; }).catch(() => hit);
      return hit || net;
    })));
  }
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => cs.length ? cs[0].focus() : self.clients.openWindow('./')));
});
