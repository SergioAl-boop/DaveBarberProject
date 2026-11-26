self.addEventListener("push", (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch { d = { mensaje: e.data?.text() }; }

  e.waitUntil(
    self.registration.showNotification(d.titulo || "Dave Barber Studio", {
      body: d.mensaje || "",
      icon: "/DaveBarberProject/icons/icon-192x192.png",
      badge: "/DaveBarberProject/icons/icon-96x96.png",
      data: { url: d.url || "/DaveBarberProject/" },
    })
  );
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  e.waitUntil(clients.openWindow(e.notification.data.url));
});