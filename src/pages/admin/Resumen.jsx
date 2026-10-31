import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import Encabezado from "./Encabezado";

const ESTADOS = [
  ["pendiente", "Pendiente"],
  ["confirmada", "Confirmada"],
  ["por_validar", "Por validar"],
  ["completada", "Completada"],
  ["cancelada", "Cancelada"],
  ["no_asistio", "No asistió"],
];

const aISO = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

const nombreCorto = (n = "") => {
  const [a, b] = n.trim().split(" ");
  return b ? `${a} ${b[0]}.` : a;
};

const iniciales = (n = "") =>
  n.trim().split(" ").slice(0, 2).map((p) => p[0]).join("").toUpperCase();

export default function Resumen() {
  const [reservas, setReservas] = useState([]);
  const [porValidar, setPorValidar] = useState(0);
  const [cargando, setCargando] = useState(true);

  const hoy = aISO(new Date());
  const finSemana = aISO(new Date(Date.now() + 6 * 86400000));

  const cargar = async () => {
    const [{ data }, { count }] = await Promise.all([
      supabase
        .from("reservas")
        .select("id, fecha, hora_inicio, estado, precio, perfiles(nombre), servicios(nombre)")
        .gte("fecha", hoy)
        .lte("fecha", finSemana)
        .order("fecha")
        .order("hora_inicio"),
      supabase
        .from("reservas")
        .select("id", { count: "exact", head: true })
        .eq("estado", "por_validar"),
    ]);
    setReservas(data || []);
    setPorValidar(count || 0);
    setCargando(false);
  };

  useEffect(() => { cargar(); }, []);

  const cambiarEstado = async (id, estado) => {
    const { error } = await supabase.from("reservas").update({ estado }).eq("id", id);
    if (error) alert(error.message);
    else cargar();
  };

  const deHoy = reservas.filter((r) => r.fecha === hoy);
  const activasHoy = deHoy.filter((r) => !["cancelada", "no_asistio"].includes(r.estado));
  const ingresos = deHoy
    .filter((r) => ["confirmada", "completada"].includes(r.estado))
    .reduce((s, r) => s + Number(r.precio), 0);
  const restoSemana = reservas.filter(
    (r) => r.fecha > hoy && !["cancelada", "no_asistio"].includes(r.estado)
  ).length;

  return (
    <>
      <Encabezado titulo="Resumen del estudio" texto="Gestiona la operación de Dave Barber Studio." />

      <div className="adm-stats">
        <div className="adm-card stat">
          <small>Citas de hoy</small>
          <strong>{activasHoy.length}</strong>
          <span>+{restoSemana} esta semana</span>
        </div>
        <div className="adm-card stat">
          <small>Ingresos hoy</small>
          <strong>${ingresos.toLocaleString("es-MX")}</strong>
          <span>Citas confirmadas y completadas</span>
        </div>
        <div className="adm-card stat alerta">
          <small>Por validar</small>
          <strong>{porValidar}</strong>
          <span>Comprobantes</span>
        </div>
      </div>

      <section className="adm-card agenda">
        <div className="agenda-top">
          <h2>Agenda de hoy</h2>
          <span>{deHoy.length} {deHoy.length === 1 ? "cita" : "citas"}</span>
        </div>

        {cargando && <p className="vacio">Cargando...</p>}
        {!cargando && deHoy.length === 0 && <p className="vacio">No hay citas para hoy.</p>}

        {deHoy.map((r) => (
          <div key={r.id} className="cita">
            <strong className="cita-hora">{r.hora_inicio.slice(0, 5)}</strong>
            <span className="cita-avatar">{iniciales(r.perfiles?.nombre)}</span>
            <div className="cita-info">
              <b>{nombreCorto(r.perfiles?.nombre)}</b>
              <small>{r.servicios?.nombre}</small>
            </div>
            <select value={r.estado} onChange={(e) => cambiarEstado(r.id, e.target.value)}>
              {ESTADOS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
            <span className="cita-flecha">›</span>
          </div>
        ))}
      </section>
    </>
  );
}