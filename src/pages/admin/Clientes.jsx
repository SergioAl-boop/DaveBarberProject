import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";
import Encabezado from "./Encabezado";

const ETIQUETA = {
  pendiente: "Pendiente",
  confirmada: "Confirmada",
  por_validar: "Por validar",
  completada: "Completada",
  cancelada: "Cancelada",
  no_asistio: "No asistió",
};

const iniciales = (n = "") =>
  n.trim().split(" ").slice(0, 2).map((p) => p[0]).join("").toUpperCase() || "?";

const whatsapp = (tel = "") => {
  const d = tel.replace(/\D/g, "");
  if (!d) return null;
  return `https://wa.me/${d.length === 10 ? "52" + d : d}`;
};

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [buscar, setBuscar] = useState("");
  const [abierto, setAbierto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    supabase
      .from("perfiles")
      .select(
        "id, nombre, telefono, creado_en, reservas(id, fecha, hora_inicio, estado, precio, servicios(nombre))"
      )
      .eq("rol", "cliente")
      .order("creado_en", { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setClientes(data || []);
        setCargando(false);
      });
  }, []);

  const filas = useMemo(() => {
    const hoy = new Date().toISOString().slice(0, 10);
    return clientes
      .map((c) => {
        const citas = [...(c.reservas || [])].sort((a, b) =>
          (b.fecha + b.hora_inicio).localeCompare(a.fecha + a.hora_inicio)
        );
        const hechas = citas.filter((r) => r.estado === "completada");
        return {
          ...c,
          citas,
          total: citas.filter((r) => !["cancelada", "no_asistio"].includes(r.estado)).length,
          proximas: citas.filter(
            (r) => r.fecha >= hoy && ["pendiente", "por_validar", "confirmada"].includes(r.estado)
          ).length,
          gastado: hechas.reduce((s, r) => s + Number(r.precio), 0),
          ultima: hechas[0]?.fecha || null,
        };
      })
      .filter((c) => {
        const q = buscar.trim().toLowerCase();
        return !q || c.nombre?.toLowerCase().includes(q) || c.telefono?.includes(q);
      });
  }, [clientes, buscar]);

  return (
    <>
      <Encabezado titulo="Clientes" texto="Consulta quién te visita y su historial de citas." />

      <div className="cli-top">
        <input
          className="cli-buscar"
          placeholder="Buscar por nombre o teléfono"
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
        />
        <span>{filas.length} {filas.length === 1 ? "cliente" : "clientes"}</span>
      </div>

      {error && <p className="ag-error">{error}</p>}
      {cargando && <div className="adm-card vacio">Cargando...</div>}
      {!cargando && filas.length === 0 && (
        <div className="adm-card vacio">No hay clientes que coincidan.</div>
      )}

      <div className="adm-card cli-lista">
        {filas.map((c) => {
          const wa = whatsapp(c.telefono);
          return (
            <div key={c.id} className="cli-item">
              <div
                className="cli-fila"
                onClick={() => setAbierto(abierto === c.id ? null : c.id)}
              >
                <span className="cita-avatar">{iniciales(c.nombre)}</span>

                <div className="cli-info">
                  <b>{c.nombre || "Sin nombre"}</b>
                  <small>{c.telefono || "Sin teléfono"}</small>
                </div>

                <div className="cli-dato"><b>{c.total}</b><small>Citas</small></div>
                <div className="cli-dato"><b>${c.gastado.toLocaleString("es-MX")}</b><small>Gastado</small></div>
                {c.proximas > 0 && <span className="ag-estado confirmada">{c.proximas} próxima{c.proximas > 1 && "s"}</span>}

                {wa && (
                  <a
                    className="cli-wa"
                    href={wa}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    WhatsApp
                  </a>
                )}
                <span className="cita-flecha">{abierto === c.id ? "⌄" : "›"}</span>
              </div>

              {abierto === c.id && (
                <div className="cli-detalle">
                  <p>
                    Cliente desde {new Date(c.creado_en).toLocaleDateString("es-MX")}
                    {c.ultima && <> · Última visita: {c.ultima}</>}
                  </p>
                  {c.citas.length === 0 && <p>Aún no tiene citas.</p>}
                  {c.citas.map((r) => (
                    <div key={r.id} className="cli-cita">
                      <strong>{r.fecha}</strong>
                      <span>{r.hora_inicio.slice(0, 5)}</span>
                      <span className="cli-serv">{r.servicios?.nombre}</span>
                      <span>${Number(r.precio)}</span>
                      <span className={`ag-estado ${r.estado}`}>{ETIQUETA[r.estado]}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}