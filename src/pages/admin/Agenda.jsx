import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";
import Encabezado from "./Encabezado";

const DIAS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio",
  "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

const ETIQUETA = {
  pendiente: "Pendiente",
  confirmada: "Confirmada",
  por_validar: "Por validar",
  completada: "Completada",
  cancelada: "Cancelada",
  no_asistio: "No asistió",
};

const aISO = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const titularDia = (iso, hoy, manana) => {
  const d = new Date(iso + "T00:00:00");
  const base = `${DIAS[d.getDay()]} ${d.getDate()} de ${MESES[d.getMonth()]}`;
  if (iso === hoy) return `Hoy · ${base}`;
  if (iso === manana) return `Mañana · ${base}`;
  return base;
};

const iniciales = (n = "") =>
  n.trim().split(" ").slice(0, 2).map((p) => p[0]).join("").toUpperCase();

export default function Agenda() {
  const [reservas, setReservas] = useState([]);
  const [filtro, setFiltro] = useState("proximas");
  const [cargando, setCargando] = useState(true);
  const [trabajando, setTrabajando] = useState(null);
  const [error, setError] = useState("");

  const ahora = new Date();
  const hoy = aISO(ahora);
  const manana = aISO(new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() + 1));

  const cargar = async () => {
    const desde = aISO(new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() - 60));
    const { data, error } = await supabase
      .from("reservas")
      .select(
        "id, fecha, hora_inicio, hora_fin, estado, precio, anticipo, perfiles(nombre, telefono), servicios(nombre), pagos(id, estado, referencia, monto)"
      )
      .gte("fecha", desde)
      .order("fecha")
      .order("hora_inicio");

    if (error) setError(error.message);
    else setReservas(data || []);
    setCargando(false);
  };

  useEffect(() => { cargar(); }, []);

  const cambiar = async (r, estado, pagoEstado) => {
    setError("");
    setTrabajando(r.id);

    const { error: e1 } = await supabase.from("reservas").update({ estado }).eq("id", r.id);
    if (e1) {
      setError(e1.message);
      setTrabajando(null);
      return;
    }

    if (pagoEstado) {
      const { error: e2 } = await supabase
        .from("pagos")
        .update({
          estado: pagoEstado,
          pagado_en: pagoEstado === "pagado" ? new Date().toISOString() : null,
        })
        .eq("reserva_id", r.id);
      if (e2) setError(e2.message);
    }

    setTrabajando(null);
    cargar();
  };

  const confirmar = (r) => cambiar(r, "confirmada", "pagado");

  const rechazar = (r) => {
    if (!confirm("¿Rechazar el comprobante? La cita se cancelará y la hora quedará libre.")) return;
    cambiar(r, "cancelada", "fallido");
  };

  const cancelar = (r) => {
    if (!confirm("¿Cancelar esta cita?")) return;
    cambiar(r, "cancelada");
  };

  const verComprobante = async (ruta) => {
    const ventana = window.open("", "_blank");
    const { data, error } = await supabase.storage
      .from("comprobantes")
      .createSignedUrl(ruta, 120);

    if (error || !data?.signedUrl) {
      ventana?.close();
      setError("No se pudo abrir el comprobante");
      return;
    }
    ventana.location.href = data.signedUrl;
  };

  const conteo = useMemo(
    () => ({
      porValidar: reservas.filter((r) => r.estado === "por_validar").length,
    }),
    [reservas]
  );

  const visibles = useMemo(() => {
    if (filtro === "por_validar") return reservas.filter((r) => r.estado === "por_validar");
    if (filtro === "proximas")
      return reservas.filter(
        (r) => r.fecha >= hoy && !["cancelada", "no_asistio", "completada"].includes(r.estado)
      );
    return [...reservas].reverse();
  }, [reservas, filtro, hoy]);

  const grupos = useMemo(() => {
    const mapa = new Map();
    visibles.forEach((r) => {
      if (!mapa.has(r.fecha)) mapa.set(r.fecha, []);
      mapa.get(r.fecha).push(r);
    });
    return [...mapa.entries()];
  }, [visibles]);

  return (
    <>
      <Encabezado titulo="Agenda" texto="Valida los anticipos y administra las citas del estudio." />

      <div className="ag-tabs">
        <button className={filtro === "proximas" ? "on" : ""} onClick={() => setFiltro("proximas")}>
          Próximas
        </button>
        <button className={filtro === "por_validar" ? "on" : ""} onClick={() => setFiltro("por_validar")}>
          Por validar
          {conteo.porValidar > 0 && <i>{conteo.porValidar}</i>}
        </button>
        <button className={filtro === "historial" ? "on" : ""} onClick={() => setFiltro("historial")}>
          Historial
        </button>
        <button className="ag-refrescar" onClick={cargar}>Actualizar</button>
      </div>

      {error && <p className="ag-error">{error}</p>}
      {cargando && <div className="adm-card vacio">Cargando...</div>}
      {!cargando && grupos.length === 0 && (
        <div className="adm-card vacio">No hay citas en esta vista.</div>
      )}

      {grupos.map(([fecha, lista]) => (
        <section key={fecha} className="ag-dia">
          <h2>{filtro === "historial" ? titularDia(fecha, hoy, manana) : titularDia(fecha, hoy, manana)}</h2>

          <div className="adm-card ag-lista">
            {lista.map((r) => {
              const pago = r.pagos?.[0];
              const ocupado = trabajando === r.id;

              return (
                <article key={r.id} className={`ag-cita ${r.estado}`}>
                  <strong className="ag-hora">{r.hora_inicio.slice(0, 5)}</strong>

                  <span className="cita-avatar">{iniciales(r.perfiles?.nombre)}</span>

                  <div className="ag-info">
                    <b>{r.perfiles?.nombre || "Cliente"}</b>
                    <small>
                      {r.servicios?.nombre} · ${Number(r.precio)}
                      {r.perfiles?.telefono && <> · {r.perfiles.telefono}</>}
                    </small>
                  </div>

                  <span className={`ag-estado ${r.estado}`}>{ETIQUETA[r.estado]}</span>

                  <div className="ag-acciones">
                    {pago?.referencia && (
                      <button className="ghost" onClick={() => verComprobante(pago.referencia)}>
                        Ver comprobante
                      </button>
                    )}

                    {r.estado === "por_validar" && (
                      <>
                        <button className="ok" disabled={ocupado} onClick={() => confirmar(r)}>
                          Confirmar
                        </button>
                        <button className="mal" disabled={ocupado} onClick={() => rechazar(r)}>
                          Rechazar
                        </button>
                      </>
                    )}

                    {r.estado === "pendiente" && (
                      <>
                        <button className="ok" disabled={ocupado} onClick={() => confirmar(r)}>
                          Confirmar
                        </button>
                        <button className="mal" disabled={ocupado} onClick={() => cancelar(r)}>
                          Cancelar
                        </button>
                      </>
                    )}

                    {r.estado === "confirmada" && (
                      <>
                        <button className="ok" disabled={ocupado} onClick={() => cambiar(r, "completada")}>
                          Completada
                        </button>
                        <button className="ghost" disabled={ocupado} onClick={() => cambiar(r, "no_asistio")}>
                          No asistió
                        </button>
                        <button className="mal" disabled={ocupado} onClick={() => cancelar(r)}>
                          Cancelar
                        </button>
                      </>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </>
  );
}