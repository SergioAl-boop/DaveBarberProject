import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Cuenta.css";

export default function Restablecer() {
  const { cambiarPassword } = useAuth();
  const navigate = useNavigate();
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  const [ver, setVer] = useState(false);
  const [error, setError] = useState("");
  const [listo, setListo] = useState(false);
  const [cargando, setCargando] = useState(false);

  const enviar = async (e) => {
    e.preventDefault();
    setError("");
    if (pass.length < 8) return setError("La contraseña debe tener al menos 8 caracteres");
    if (pass !== pass2) return setError("Las contraseñas no coinciden");

    setCargando(true);
    try {
      await cambiarPassword(pass);
      setListo(true);
      setTimeout(() => navigate("/?login=1", { replace: true }), 2500);
    } catch (err) {
      setError(
        /session|auth/i.test(err.message)
          ? "El enlace expiró o ya se usó. Solicita uno nuevo."
          : err.message
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="cuenta">
      <section className="cuenta-card" style={{ maxWidth: 420 }}>
        <h2>Nueva contraseña</h2>

        {listo ? (
          <p className="cuenta-vacio">
             Contraseña actualizada.
          </p>
        ) : (
          <form onSubmit={enviar} style={{ display: "grid", gap: "0.8rem", marginTop: "1rem" }}>
            <input
              type={ver ? "text" : "password"}
              placeholder="Nueva contraseña (mínimo 8)"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              required
              style={{ padding: "0.8rem", border: "1px solid #dfe5ea", borderRadius: 6 }}
            />
            <input
              type={ver ? "text" : "password"}
              placeholder="Repite la contraseña"
              value={pass2}
              onChange={(e) => setPass2(e.target.value)}
              required
              style={{ padding: "0.8rem", border: "1px solid #dfe5ea", borderRadius: 6 }}
            />
            <label style={{ fontSize: "0.8rem" }}>
              <input type="checkbox" checked={ver} onChange={() => setVer(!ver)} /> Mostrar contraseñas
            </label>

            {error && <p style={{ color: "#d91f2e", fontSize: "0.85rem" }}>{error}</p>}

            <button className="rv-btn" disabled={cargando}>
              {cargando ? "Guardando..." : "Guardar contraseña"}
            </button>
            <Link to="/" style={{ textAlign: "center", fontSize: "0.8rem" }}>Volver al inicio</Link>
          </form>
        )}
      </section>
    </main>
  );
}