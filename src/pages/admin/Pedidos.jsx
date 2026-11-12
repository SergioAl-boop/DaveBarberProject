import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";
import Encabezado from "./Encabezado";

const ETIQUETA = {
  por_validar: "Por validar",
  confirmado: "Por entregar",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

const fechaCorta = (iso) =>
  new Date(iso).toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" });

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [filtro, setFiltro] = useState("por_validar");
  const [cargando, setCargando] = useState(true);
  const [trabajando, setTrabajando] = useState(null);
  const [error, setError] = useState("");

  const cargar = async () => {
    const { data, error } = await supabase
      .from("pedidos")
      .select("id, total, estado, comprobante, creado_en, perfiles(nombre, telefono), pedido_items(nombre, precio, cantidad)")
      .order("creado_en", { ascending: false });
    if (error) setError(error.message);
    else setPedidos(data || []);
    setCargando(false);
  };
  useEffect(() => { cargar(); }, []);

  const cambiar = async (p, estado) => {
    setError("");
    setTrabajando(p.id);
    const { error } = await supabase.from("pedidos").update({ estado }).eq("id", p.id);
    if (error) setError(error.message);
    setTrabajando(null);
    cargar();
  };

  const rechazar = (p) => {
    if (!confirm("¿Rechazar el pago? El pedido se cancelará y el stock se devolverá.")) return;
    cambiar(p, "cancelado");
  };

  const verComprobante = async (ruta) => {
    const ventana = window.open("", "_blank");
    const { data, error } = await supabase.storage.from("comprobantes").createSignedUrl(ruta, 120);
    if (error || !data?.signedUrl) {
      ventana?.close();
      return setError("No se pudo abrir el comprobante");
    }
    ventana.location.href = data.signedUrl;
  };

  const porValidar = pedidos.filter((p) => p.estado === "por_validar").length;

  const visibles = useMemo(() => {
    if (filtro === "historial")
      return pedidos.filter((p) => ["entregado", "cancelado"].includes(p.estado));
    return pedidos.filter((p) => p.estado === filtro);
  }, [pedidos, filtro]);

  return (
    <>
      <Encabezado titulo="Pedidos" texto="Valida los pagos de los productos apartados y entrégalos." />

      <div className="ag-tabs">
        <button className={filtro === "por_validar" ? "on" : ""} onClick={() => setFiltro("por_validar")}>
          Por validar {porValidar > 0 && <i>{porValidar}</i>}
        </button>
        <button className={filtro === "confirmado" ? "on" : ""} onClick={() => setFiltro("confirmado")}>
          Por entregar
        </button>
        <button className={filtro === "historial" ? "on" : ""} onClick={() => setFiltro("historial")}>
          Historial
        </button>
        <button className="ag-refrescar" onClick={cargar}>Actualizar</button>
      </div>

      {error && <p className="ag-error">{error}</p>}
      {cargando && <div className="adm-card vacio">Cargando...</div>}
      {!cargando && visibles.length === 0 && (
        <div className="adm-card vacio">No hay pedidos en esta vista.</div>
      )}

      <div className="adm-card ag-lista">
        {visibles.map((p) => {
          const ocupado = trabajando === p.id;
          return (
            <article key={p.id} className={`ag-cita ${p.estado === "por_validar" ? "por_validar" : ""}`}>
              <div className="ag-info">
                <b>{p.perfiles?.nombre || "Cliente"} · ${Number(p.total)}</b>
                <small>
                  {fechaCorta(p.creado_en)}
                  {p.perfiles?.telefono && <> · {p.perfiles.telefono}</>}
                </small>
                <small>
                  {p.pedido_items.map((i) => `${i.cantidad}× ${i.nombre}`).join(", ")}
                </small>
              </div>

              <span className={`ag-estado ${p.estado === "confirmado" ? "confirmada" : p.estado}`}>
                {ETIQUETA[p.estado]}
              </span>

              <div className="ag-acciones">
                {p.comprobante && (
                  <button className="ghost" onClick={() => verComprobante(p.comprobante)}>
                    Ver comprobante
                  </button>
                )}

                {p.estado === "por_validar" && (
                  <>
                    <button className="ok" disabled={ocupado} onClick={() => cambiar(p, "confirmado")}>Confirmar pago</button>
                    <button className="mal" disabled={ocupado} onClick={() => rechazar(p)}>Rechazar</button>
                  </>
                )}

                {p.estado === "confirmado" && (
                  <>
                    <button className="ok" disabled={ocupado} onClick={() => cambiar(p, "entregado")}>Entregado</button>
                    <button className="mal" disabled={ocupado} onClick={() => rechazar(p)}>Cancelar</button>
                  </>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}