import { useEffect, useState } from "react";
import OneSignal from "react-onesignal";
import { useAuth } from "../context/AuthContext";

export default function BotonNotificaciones({ className = "" }) {
  const { user } = useAuth();
  const [suscrito, setSuscrito] = useState(false);
  const [cargando, setCargando] = useState(false);

  // Detectar si el navegador actual ya tiene permisos y suscripción activa
  useEffect(() => {
    const verificarEstado = () => {
      try {
        const permiso = OneSignal.Notifications?.permission;
        const optedIn = OneSignal.User?.PushSubscription?.optedIn;
        setSuscrito(Boolean(permiso && optedIn));
      } catch {
        // Ignorar si OneSignal aún está terminando de inicializar
      }
    };

    verificarEstado();
    const timer = setTimeout(verificarEstado, 2000);
    return () => clearTimeout(timer);
  }, []);

  const activarNotificaciones = async () => {
    setCargando(true);
    try {
      // 1. Pedir permiso nativo al navegador / sistema operativo
      await OneSignal.Notifications.requestPermission();

      // 2. Asegurar que el usuario quede vinculado a su UUID de Supabase
      if (user?.id) {
        await OneSignal.login(user.id);
      }

      // 3. Activar suscripción push explícitamente
      await OneSignal.User.PushSubscription.optIn();

      const permiso = OneSignal.Notifications?.permission;
      setSuscrito(Boolean(permiso));
    } catch (error) {
      console.error("Error al activar notificaciones:", error);
      alert("Asegúrate de permitir las notificaciones en los ajustes de tu navegador.");
    } finally {
      setCargando(false);
    }
  };

  // Detectar si está en iPhone/iPad Safari sin instalar como PWA
  const esIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const esStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;

  if (esIOS && !esStandalone) {
    return (
      <span className={className} style={{ fontSize: "0.8rem", opacity: 0.85, cursor: "default" }}>
        📲 iPhone: toca Compartir → &quot;Agregar a inicio&quot; para activar avisos
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={activarNotificaciones}
      disabled={cargando || suscrito}
      className={className}
    >
      {cargando
        ? "Activando..."
        : suscrito
        ? " Notificaciones activas"
        : " Activar notificaciones"}
    </button>
  );
}