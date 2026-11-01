import { supabase } from "./supabase";

const aUint8 = (b64) => {
  const pad = "=".repeat((4 - (b64.length % 4)) % 4);
  const raw = atob((b64 + pad).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
};

export const pushSoportado = () =>
  "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;

export async function activarPush(userId) {
  if (!pushSoportado()) {
    throw new Error("Este navegador no soporta notificaciones. En iPhone, agrega el sitio a tu pantalla de inicio.");
  }

  const permiso = await Notification.requestPermission();
  if (permiso !== "granted") throw new Error("Permiso de notificaciones denegado");

  const reg = await navigator.serviceWorker.register("/sw.js");
  await navigator.serviceWorker.ready;

  let sub = await reg.pushManager.getSubscription();
  if (!sub) {
    sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: aUint8(import.meta.env.VITE_VAPID_PUBLIC_KEY),
    });
  }

  const j = sub.toJSON();
  const { error } = await supabase.from("push_subscriptions").upsert(
    { usuario_id: userId, endpoint: j.endpoint, p256dh: j.keys.p256dh, auth: j.keys.auth },
    { onConflict: "endpoint" }
  );
  if (error) throw error;
}