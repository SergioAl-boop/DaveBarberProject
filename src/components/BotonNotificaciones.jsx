import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { activarPush, pushSoportado } from "../lib/push";

export default function BotonNotificaciones({ className = "" }) {
  const { user } = useAuth();
  const [estado, setEstado] = useState("inactivo");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || !pushSoportado()) return;
    if (Notification.permission === "granted") {
      activarPush(user.id)
        .then(() => setEstado("activo"))
        .catch((e) => setError(e.message || String(e)));
    }
  }, [user]);

  if (!user) return null;

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
        <span className={className}> Notificaciones activas</span>
      ) : (
        <button className={className} onClick={activar}> Activar notificaciones</button>
      )}
      {error && <small style={{ color: "#d91f2e", display: "block" }}>{error}</small>}
    </>
  );
}