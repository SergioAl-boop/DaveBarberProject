import { useEffect } from "react";
import "../styles/Toast.css";

export default function Toast({ mensaje, tipo = "ok", onClose, duracion = 3500 }) {
  useEffect(() => {
    const t = setTimeout(onClose, duracion);
    return () => clearTimeout(t);
  }, [onClose, duracion]);

  return (
    <div className={`toast ${tipo}`} role="status">
      <span>{tipo === "ok" ? "✓" : "!"}</span>
      {mensaje}
    </div>
  );
}