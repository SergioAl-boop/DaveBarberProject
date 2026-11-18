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

const Ojo = ({ visible }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    {visible ? (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M14.12 14.12a3 3 0 1 1-4.24-4.24" />
        <path d="M1 1l22 22" />
      </>
    ) : (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    )}
  </svg>
);

const soloDigitos = (v) => v.replace(/\D/g, "").slice(0, 10);

const validarRegistro = (f) => {
  if (f.nombre.trim().length < 3) return "Escribe tu nombre completo";
  if (f.telefono.length !== 10) return "El teléfono debe tener exactamente 10 dígitos";
  if (!/^\S+@\S+\.\S+$/.test(f.email)) return "Correo electrónico no válido";
  if (f.password.length < 8) return "La contraseña debe tener al menos 8 caracteres";
  return "";
};

export default function LoginModal({ onClose, onLogin }) {
  const { login, registrar, recuperar } = useAuth();
  const navigate = useNavigate();

  const [paso, setPaso] = useState("login");
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");
  const [cargando, setCargando] = useState(false);
  const [verPass, setVerPass] = useState(false);
  const [form, setForm] = useState({ nombre: "", telefono: "", email: "", password: "" });

  const cambiar = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "telefono" ? soloDigitos(value) : value });
  };

  const ir = (p) => {
    setError("");
    setAviso("");
    setVerPass(false);
    setPaso(p);
  };

  const enviar = async (e) => {
    e.preventDefault();
    setError("");
    setAviso("");
    setCargando(true);

    try {
      if (paso === "recuperar") {
        if (!/^\S+@\S+\.\S+$/.test(form.email)) {
          setError("Correo electrónico no válido");
          return;
        }
        await recuperar(form.email);
        setAviso("Si el correo está registrado, recibirás un enlace para cambiar tu contraseña.");
        return;
      }

      if (paso === "registro") {
        const msg = validarRegistro(form);
        if (msg) {
          setError(msg);
          return;
        }
        await registrar(form);
        setAviso("Cuenta creada. Inicia sesión para continuar.");
        setForm({ ...form, password: "" });
        setPaso("login");
        return;
      }

      const usuario = await login(form.email, form.password);
      onClose();
      if (usuario?.rol === "admin") navigate("/admin");
      else onLogin?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  const titulos = {
    login: ["Acceso", "Bienvenido de nuevo", "Ingresa tus datos para continuar."],
    registro: ["Nueva cuenta", "Crea tu perfil", "Regístrate una vez y reserva cuando quieras."],
    recuperar: ["Recuperar acceso", "¿Olvidaste tu contraseña?", "Escribe tu correo y te enviaremos un enlace."],
  };
  const [eyebrow, titulo, subtitulo] = titulos[paso];

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
            {paso !== "login" && (
              <button type="button" className="volver" onClick={() => ir("login")}>
                ← Volver
              </button>
            )}

            <span className="modal-eyebrow">{eyebrow}</span>
            <h2>{titulo}</h2>
            <p className="modal-sub">{subtitulo}</p>

            {paso === "registro" && (
              <>
                <label>Nombre completo
                  <input name="nombre" value={form.nombre} onChange={cambiar} placeholder="Ej. Daniel García" required />
                </label>
                <label>Teléfono
                  <input
                    name="telefono"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={form.telefono}
                    onChange={cambiar}
                    placeholder="10 dígitos, ej. 9511234567"
                    required
                  />
                </label>
              </>
            )}

            <label>Correo electrónico
              <input name="email" type="email" value={form.email} onChange={cambiar} placeholder="nombre@correo.com" required />
            </label>

            {paso !== "recuperar" && (
              <label>Contraseña
                <div className="pass-wrap">
                  <input
                    name="password"
                    type={verPass ? "text" : "password"}
                    value={form.password}
                    onChange={cambiar}
                    placeholder="Mínimo 8 caracteres"
                    required
                  />
                  <button
                    type="button"
                    className="pass-ojo"
                    onClick={() => setVerPass(!verPass)}
                    aria-label={verPass ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    <Ojo visible={verPass} />
                  </button>
                </div>
              </label>
            )}

            {paso === "login" && (
              <button type="button" className="olvide" onClick={() => ir("recuperar")}>
                ¿Olvidaste tu contraseña?
              </button>
            )}

            {error && <p className="modal-error">{error}</p>}
            {aviso && <p className="modal-aviso">{aviso}</p>}

            <button className="btn-entrar" disabled={cargando}>
              {cargando
                ? "Procesando..."
                : paso === "registro"
                ? "Crear cuenta"
                : paso === "recuperar"
                ? "Enviar enlace"
                : "Entrar"}
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