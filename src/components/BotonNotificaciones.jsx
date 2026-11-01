import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { activarPush, pushSoportado } from "../lib/push";

export default function BotonNotificaciones({ className = "" }) {
  const { user } = useAuth();
  const [estado, setEstado] = useState(
    pushSoportado() && Notification.permission === "granted" ? "activo" : "inactivo"
  );
  const [error, setError] = useState("");

  if (!user) return null;

  const activar = async () => {
    setError("");
    try {
      await activarPush(user.id);
      setEstado("activo");
    } catch (e) {
      setError(e.message);
    }
  };

  if (estado === "activo") return <span className={className}> Notificaciones activas</span>;

  return (
    <>
      <button className={className} onClick={activar}> Activar notificaciones</button>
      {error && <small style={{ color: "#d91f2e" }}>{error}</small>}
    </>
  );
}