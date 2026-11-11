/* NAHİV — çevrimdışı çalışma. Sayfa ağdan önce denenir, olmazsa önbellekten gelir.
   /api isteklerine hiç dokunulmaz. */
const SURUM = "nahiv-v3";
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(SURUM).then((c) => c.addAll(["/", "/manifest.webmanifest", "/ikon.svg", "/ikon-192.png", "/ikon-512.png"])).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== SURUM).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin || u.pathname.startsWith("/api/")) return;
  e.respondWith(
    fetch(e.request).then((r) => {
      if (r.ok) { const k = r.clone(); caches.open(SURUM).then((c) => c.put(e.request, k)); }
      return r;
    }).catch(() => caches.match(e.request).then((m) => m || caches.match("/")))
  );
});
