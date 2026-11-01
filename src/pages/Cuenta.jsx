import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import BotonNotificaciones from "../components/BotonNotificaciones";
import "../styles/Cuenta.css";

const ESTADOS = {
  pendiente: "Pendiente",
  confirmada: "Confirmada",
  por_validar: "Por validar",
  completada: "Completada",
  cancelada: "Cancelada",
  no_asistio: "No asistió",
};

export default function Cuenta() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [citas, setCitas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    supabase
      .from("reservas")
      .select("id, fecha, hora_inicio, estado, servicios(nombre)")
      .order("fecha", { ascending: false })
      .then(({ data }) => {
        setCitas(data || []);
        setCargando(false);
      });
  }, []);

  const salir = async () => {
    await logout();
    navigate("/");
  };

  return (
    <main className="cuenta">
      <header className="cuenta-top">
        <div>
          <span>Mi cuenta</span>
          <h1>Hola, {user?.nombre?.split(" ")[0]}</h1>
        </div>
        <div className="cuenta-acciones">
          <Link to="/">← Ver sitio</Link>
          <BotonNotificaciones className="cuenta-notif" />
          <button onClick={salir}>Cerrar sesión</button>
        </div>
      </header>

      <section className="cuenta-card">
        <h2>Mis citas</h2>
        {cargando && <p className="cuenta-vacio">Cargando...</p>}
        {!cargando && citas.length === 0 && (
          <p className="cuenta-vacio">Aún no tienes citas.</p>
        )}
        {citas.map((c) => (
          <div key={c.id} className="cuenta-cita">
            <strong>{c.fecha}</strong>
            <span>{c.hora_inicio.slice(0, 5)}</span>
            <span className="cuenta-servicio">{c.servicios?.nombre}</span>
            <em>{ESTADOS[c.estado]}</em>
          </div>
        ))}
      </section>
    </main>
  );
}