import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { activarPush, pushSoportado } from "../lib/push";

export default function BotonNotificaciones({ className = "" }) {
  const { user } = useAuth();
  const [estado, setEstado] = useState("inactivo");
  const [error, setError] = useState("");
  const [requiereInstalarIOS, setRequiereInstalarIOS] = useState(false);

  useEffect(() => {
    const esIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    //const esStandalone = true;
   const esStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    if (esIOS && !esStandalone) {
      setRequiereInstalarIOS(true);
      return;
    }

    if (!user || !pushSoportado()) return;

    if ("Notification" in window && Notification.permission === "granted") {
      activarPush(user.id)
        .then(() => setEstado("activo"))
        .catch((e) => setError(e.message || String(e)));
    }
  }, [user]);

  if (!user) return null;

  if (requiereInstalarIOS) {
    return (
      <div className="aviso-ios-push">
        Para recibir avisos de tu cita en iPhone: toca <strong>Compartir</strong> (abajo) y luego{" "}
        <strong>"Agregar a pantalla de inicio"</strong>.
      </div>
    );
  }

  const activar = async () => {
    setError("");
    try {
      await activarPush(user.id);
      setEstado("activo");
    } catch (e) {
      setError(e.message || String(e));
    }
  };

  return (
    <>
      {estado === "activo" ? (
        <span className={className}>Notificaciones activas</span>
      ) : (
        <button className={className} onClick={activar}>
          Activar notificaciones
        </button>
      )}
      {error && <small className="error-push">{error}</small>}
    </>
  );
}