import { supabase } from "./supabase";

const aUint8 = (b64) => {
  const pad = "=".repeat((4 - (b64.length % 4)) % 4);
  const raw = atob((b64 + pad).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
};

export const pushSoportado = () =>
  typeof window !== "undefined" &&
  "serviceWorker" in navigator &&
  "PushManager" in window &&
  "Notification" in window;

let enCurso = null;

export function activarPush() {
  if (!enCurso) {
    enCurso = _activarPush().finally(() => {
      enCurso = null;
    });
  }
  return enCurso;
}

async function _activarPush() {
  if (!pushSoportado()) {
    throw new Error(
      "Este navegador no soporta notificaciones. En iPhone, agrega el sitio a tu pantalla de inicio."
    );
  }

  // 1. Pedir permiso directo en el gesto del clic (obligatorio en iOS Safari)
  const permiso = await Notification.requestPermission();
  if (permiso !== "granted") {
    throw new Error("Permiso de notificaciones denegado");
  }

  // 2. Registrar SW asegurando el scope correcto
  const baseUrl = import.meta.env.BASE_URL || "/";
  const reg = await navigator.serviceWorker.register(`${baseUrl}sw.js`, {
    scope: baseUrl,
  });

  // Esperar a que esté activo si aún se está instalando
  if (reg.installing) {
    await new Promise((resolve) => {
      reg.installing.addEventListener("statechange", (e) => {
        if (e.target.state === "activated") resolve();
      });
    });
  }
  await navigator.serviceWorker.ready;

  // 3. Obtener o crear suscripción Push
  const vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
  if (!vapidKey) {
    throw new Error("Falta configurar VITE_VAPID_PUBLIC_KEY");
  }

  let sub = await reg.pushManager.getSubscription();
  if (!sub) {
    sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: aUint8(vapidKey),
    });
  }

  // 4. Guardar en Supabase
  const j = sub.toJSON();
  if (!j.keys?.p256dh || !j.keys?.auth) {
    throw new Error("El navegador no generó las llaves de cifrado Push.");
  }

  const { error } = await supabase.rpc("guardar_suscripcion", {
    p_endpoint: j.endpoint,
    p_p256dh: j.keys.p256dh,
    p_auth: j.keys.auth,
  });

  if (error) throw error;
}