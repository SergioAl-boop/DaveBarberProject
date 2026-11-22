import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import Encabezado from "./Encabezado";

const aISO = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const bonita = (iso) =>
  new Date(iso + "T00:00:00").toLocaleDateString("es-MX", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

export default function Disponibilidad() {
  const hoy = aISO(new Date());
  const [lista, setLista] = useState([]);
  const [desde, setDesde] = useState(hoy);
  const [hasta, setHasta] = useState(hoy);
  const [motivo, setMotivo] = useState("");
  const [msg, setMsg] = useState("");
  const [cargando, setCargando] = useState(false);

  const cargar = async () => {
    const { data } = await supabase
      .from("bloqueos").select("*").gte("fecha", hoy).order("fecha");
    setLista(data || []);
  };
  useEffect(() => { cargar(); }, []);

  const bloquear = async (e) => {
    e.preventDefault();
    setMsg("");
    if (hasta < desde) return setMsg("❌ La fecha final no puede ser anterior a la inicial");

    const fechas = [];
    const fin = new Date(hasta + "T00:00:00");
    for (let d = new Date(desde + "T00:00:00"); d <= fin; d.setDate(d.getDate() + 1)) {
      fechas.push(aISO(d));
      if (fechas.length > 366) return setMsg("❌ El rango es demasiado largo");
    }

    setCargando(true);
    try {
      const { count } = await supabase
        .from("reservas")
        .select("id", { count: "exact", head: true })
        .gte("fecha", desde).lte("fecha", hasta)
        .not("estado", "in", "(cancelada,no_asistio)");

      if (count > 0 &&
        !confirm(`Hay ${count} cita(s) en esas fechas. Seguirán existiendo, así que tendrás que cancelarlas desde Agenda. ¿Bloquear de todos modos?`)) {
        return;
      }

      const { error } = await supabase.from("bloqueos").upsert(
        fechas.map((fecha) => ({ fecha, motivo: motivo || null })),
        { onConflict: "fecha" }
      );
      if (error) throw error;

      setMsg(`✅ ${fechas.length} día(s) bloqueado(s)`);
      setMotivo("");
      cargar();
    } catch (err) {
      setMsg("❌ " + err.message);
    } finally {
      setCargando(false);
    }
  };

  const quitar = async (fecha) => {
    const { error } = await supabase.from("bloqueos").delete().eq("fecha", fecha);
    if (error) setMsg("❌ " + error.message);
    else cargar();
  };

  return (
    <>
      <Encabezado
        titulo="Disponibilidad"
        texto="Bloquea los días en que no puedes atender. Los clientes verán «No hay citas disponibles»."
      />

      <div className="admin-card">
        <h2>Bloquear días</h2>
        <form onSubmit={bloquear}>
          <label className="admin-hint">Desde
            <input type="date" min={hoy} value={desde}
                   onChange={(e) => { setDesde(e.target.value); if (hasta < e.target.value) setHasta(e.target.value); }}
                   required />
          </label>
          <label className="admin-hint">Hasta
            <input type="date" min={desde} value={hasta}
                   onChange={(e) => setHasta(e.target.value)} required />
          </label>
          <input placeholder="Motivo (solo lo ves tú): vacaciones, trámite..."
                 value={motivo} onChange={(e) => setMotivo(e.target.value)} />
          <div className="admin-botones">
            <button disabled={cargando}>{cargando ? "Guardando..." : "Bloquear"}</button>
          </div>
          {msg && <p className="admin-msg">{msg}</p>}
        </form>

        <h2>Días bloqueados ({lista.length})</h2>
        {lista.length === 0 && <p className="admin-hint">No hay días bloqueados.</p>}
        <ul className="admin-lista">
          {lista.map((b) => (
            <li key={b.fecha}>
              <span>
                {bonita(b.fecha)}
                {b.motivo && <small>{b.motivo}</small>}
              </span>
              <button className="gris" onClick={() => quitar(b.fecha)}>Quitar</button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}