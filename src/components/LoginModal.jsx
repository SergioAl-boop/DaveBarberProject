import { useState } from "react";
import logo from "../assets/logodave.jpeg";
import "../styles/LoginModal.css";

const Arrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export default function LoginModal({ onClose }) {
  const [paso, setPaso] = useState("elegir");

  const enviar = (e) => {
    e.preventDefault();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <aside className="modal-side">
          <img src={logo} alt="Dave Barber Studio" />
          <h3>Reserva tu tiempo.<br />Nosotros cuidamos tu estilo.</h3>
        </aside>

        <div className="modal-main">
          <button className="modal-close" onClick={onClose} aria-label="Cerrar">✕</button>

          {paso === "elegir" && (
            <>
              <span className="modal-eyebrow">Acceso</span>
              <h2>¿Cómo quieres entrar?</h2>
              <p className="modal-sub">Elige tu tipo de cuenta para continuar.</p>

              <button className="opcion" onClick={() => setPaso("cliente")}>
                <span className="opcion-icono">👤</span>
                <div>
                  <strong>Soy Cliente</strong>
                  <small>Reserva y gestiona tus citas</small>
                </div>
                <span>›</span>
              </button>

              <button className="opcion" onClick={() => setPaso("admin")}>
                <span className="opcion-icono rojo">✂</span>
                <div>
                  <strong>Soy el Barbero</strong>
                  <small>Acceso protegido al estudio</small>
                </div>
                <span>›</span>
              </button>
            </>
          )}

          {paso !== "elegir" && (
            <form onSubmit={enviar}>
              <button
                type="button"
                className="volver"
                onClick={() => setPaso(paso === "registro" ? "cliente" : "elegir")}
              >
                ← Volver
              </button>

              <span className="modal-eyebrow">
                {paso === "cliente" && "Acceso cliente"}
                {paso === "registro" && "Nueva cuenta"}
                {paso === "admin" && "Acceso administrador"}
              </span>

              <h2>
                {paso === "cliente" && "Bienvenido de nuevo"}
                {paso === "registro" && "Crea tu perfil"}
                {paso === "admin" && "Panel del barbero"}
              </h2>

              <p className="modal-sub">
                {paso === "registro"
                  ? "Regístrate una vez y reserva cuando quieras."
                  : "Ingresa tus datos para continuar."}
              </p>

              {paso === "registro" && (
                <>
                  <label>Nombre completo
                    <input type="text" placeholder="Ej. Daniel García" required />
                  </label>
                  <label>Teléfono
                    <input type="tel" placeholder="55 0000 0000" required />
                  </label>
                </>
              )}

              <label>Correo electrónico
                <input type="email" placeholder="nombre@correo.com" required />
              </label>

              <label>Contraseña
                <input type="password" placeholder="Mínimo 8 caracteres" minLength={8} required />
              </label>

              <button className="btn-entrar">
                {paso === "registro" ? "Crear cuenta y reservar" : "Entrar"}
                <Arrow />
              </button>

              {paso === "cliente" && (
                <p className="modal-pie">
                  ¿Aún no tienes cuenta?{" "}
                  <button type="button" onClick={() => setPaso("registro")}>Regístrate</button>
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}