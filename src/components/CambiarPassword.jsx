import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Toast from "./Toast";

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

function Campo({ placeholder, value, onChange }) {
  const [ver, setVer] = useState(false);
  return (
    <div className="pass-wrap">
      <input
        type={ver ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
      />
      <button
        type="button"
        className="pass-ojo"
        onClick={() => setVer(!ver)}
        aria-label={ver ? "Ocultar contraseña" : "Mostrar contraseña"}
      >
        <Ojo visible={ver} />
      </button>
    </div>
  );
}

export default function CambiarPassword() {
  const { cambiarPassword, logout } = useAuth();
  const navigate = useNavigate();

  const [abierto, setAbierto] = useState(false);
  const [nueva, setNueva] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [toast, setToast] = useState(null);

  const cerrar = () => {
    setAbierto(false);
    setNueva("");
    setConfirmar("");
    setError("");
  };

  const guardar = async (e) => {
    e.preventDefault();
    setError("");

    if (nueva.length < 8) return setError("La contraseña debe tener al menos 8 caracteres");
    if (nueva !== confirmar) return setError("Las contraseñas no coinciden");

    setCargando(true);
    try {
      await cambiarPassword(nueva);
      cerrar();
      setToast("Contraseña actualizada. Inicia sesión nuevamente");
      setTimeout(async () => {
        await logout();
        navigate("/?login=1", { replace: true });
      }, 2200);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <>
      {toast && <Toast mensaje={toast} onClose={() => setToast(null)} duracion={4000} />}

      <section className="cuenta-card" style={{ marginTop: "1.5rem" }}>
        <h2>Contraseña</h2>

        {!abierto ? (
          <button className="cuenta-notif" onClick={() => setAbierto(true)}>
            Cambiar contraseña
          </button>
        ) : (
          <form onSubmit={guardar} className="cp-form">
            <Campo placeholder="Nueva contraseña (mínimo 8)" value={nueva}
                   onChange={(e) => setNueva(e.target.value)} />
            <Campo placeholder="Confirmar contraseña" value={confirmar}
                   onChange={(e) => setConfirmar(e.target.value)} />

            {error && <p className="cp-error">{error}</p>}

            <div className="cp-botones">
              <button className="cuenta-notif" disabled={cargando}>
                {cargando ? "Guardando..." : "Guardar contraseña"}
              </button>
              <button type="button" className="cp-cancelar" onClick={cerrar}>Cancelar</button>
            </div>
          </form>
        )}
      </section>
    </>
  );
}