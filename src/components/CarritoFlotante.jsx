import { useAuth } from "../context/AuthContext";
import { useCarrito } from "../context/CarritoContext";
import "../styles/CarritoFlotante.css";

export default function CarritoFlotante() {
  const { user } = useAuth();
  const { cantidad, abrir } = useCarrito();

  if (user?.rol === "admin") return null;

  return (
    <div className="cf-wrap">
      <span className="cf-etiqueta">Ver mi carrito</span>

      <button className="carrito-flotante" onClick={abrir} aria-label="Ver mi carrito">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="9" cy="20" r="1.5" />
          <circle cx="18" cy="20" r="1.5" />
          <path d="M2 3h3l3 12h11l2-8H6" />
        </svg>
        {cantidad > 0 && <b className="cf-cantidad">{cantidad}</b>}
      </button>
    </div>
  );
}