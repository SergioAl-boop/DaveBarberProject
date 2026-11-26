self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

self.addEventListener("push", (e) => {
  let d = {};
  try {
    d = e.data ? e.data.json() : {};
  } catch {
    d = { mensaje: e.data?.text() };
  }

  const base = self.registration.scope; 

  e.waitUntil(
    self.registration.showNotification(d.titulo || "Dave Barber Studio", {
      body: d.mensaje || "",
      icon: `${base}icons/icon-192x192.png`,
      badge: `${base}icons/icon-96x96.png`,
      data: { url: d.url || base },
    })
  );
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const targetUrl = e.notification.data?.url || self.registration.scope;
  e.waitUntil(clients.openWindow(targetUrl));
});