import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logodave.jpeg";
import "../styles/LoginModal.css";

const Arrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export default function LoginModal({ onClose }) {
  const { login, registrar } = useAuth();
  const navigate = useNavigate();

  const [paso, setPaso] = useState("login");
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");
  const [cargando, setCargando] = useState(false);
  const [form, setForm] = useState({ nombre: "", telefono: "", email: "", password: "" });

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const ir = (p) => {
    setError("");
    setAviso("");
    setPaso(p);
  };

  const enviar = async (e) => {
    e.preventDefault();
    setError("");
    setAviso("");
    setCargando(true);

    try {
      if (paso === "registro") {
        await registrar(form);
        setAviso("Cuenta creada. Inicia sesión para continuar.");
        setForm({ ...form, password: "" });
        setPaso("login");
        return;
      }

      const usuario = await login(form.email, form.password);
      onClose();
      navigate(usuario?.rol === "admin" ? "/admin" : "/");
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
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

          <form onSubmit={enviar}>
            {paso === "registro" && (
              <button type="button" className="volver" onClick={() => ir("login")}>
                ← Volver
              </button>
            )}

            <span className="modal-eyebrow">
              {paso === "login" ? "Acceso" : "Nueva cuenta"}
            </span>

            <h2>{paso === "login" ? "Bienvenido de nuevo" : "Crea tu perfil"}</h2>

            <p className="modal-sub">
              {paso === "registro"
                ? "Regístrate una vez y reserva cuando quieras."
                : "Ingresa tus datos para continuar."}
            </p>

            {paso === "registro" && (
              <>
                <label>Nombre completo
                  <input name="nombre" value={form.nombre} onChange={cambiar} placeholder="Ej. Daniel García" required />
                </label>
                <label>Teléfono
                  <input name="telefono" type="tel" value={form.telefono} onChange={cambiar} placeholder="55 0000 0000" required />
                </label>
              </>
            )}

            <label>Correo electrónico
              <input name="email" type="email" value={form.email} onChange={cambiar} placeholder="nombre@correo.com" required />
            </label>

            <label>Contraseña
              <input name="password" type="password" value={form.password} onChange={cambiar} placeholder="Mínimo 8 caracteres" required />
            </label>

            {error && <p className="modal-error">{error}</p>}
            {aviso && <p className="modal-aviso">{aviso}</p>}

            <button className="btn-entrar" disabled={cargando}>
              {cargando ? "Procesando..." : paso === "registro" ? "Crear cuenta" : "Entrar"}
              <Arrow />
            </button>

            {paso === "login" && (
              <p className="modal-pie">
                ¿Aún no tienes cuenta?{" "}
                <button type="button" onClick={() => ir("registro")}>Regístrate</button>
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}