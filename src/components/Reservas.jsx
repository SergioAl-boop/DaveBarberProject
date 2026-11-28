import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { uuid } from "../lib/uuid";
import "../styles/ReservaModal.css";

const CLABE = "6381 8000 0161 3637 03";
const ANTICIPO = 100;
const PASO_MIN = 60;
const MESES_ADELANTE = 11;

const DIAS_CORTO = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const DIAS_INICIAL = ["D", "L", "M", "M", "J", "V", "S"];
const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio",
  "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

const aISO = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const deISO = (iso) => new Date(iso + "T00:00:00");
const aMin = (t) => { const [h, m] = t.split(":"); return Number(h) * 60 + Number(m); };
const aTime = (min) =>
  `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
const formatoHora = (min) => {
  const h = Math.floor(min / 60);
  return `${h % 12 || 12}:${String(min % 60).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
};

const Flecha = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export default function Reservas({ onClose }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const ahora = new Date();
  const hoy = aISO(ahora);
  const mesActual = ahora.getFullYear() * 12 + ahora.getMonth();

  const [paso, setPaso] = useState(1);
  const [servicios, setServicios] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [bloqueadas, setBloqueadas] = useState(new Set());
  const [datosListos, setDatosListos] = useState(false);
  const [servicio, setServicio] = useState(null);
  const [mes, setMes] = useState({ y: ahora.getFullYear(), m: ahora.getMonth() });
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState(null);
  const [ocupadas, setOcupadas] = useState([]);
  const [archivo, setArchivo] = useState(null);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    Promise.all([
      supabase.from("servicios").select("*").eq("activo", true).order("id"),
      supabase.from("horarios").select("*").eq("disponible", true),
      supabase.rpc("fechas_bloqueadas"),
    ]).then(([s, h, b]) => {
      setServicios(s.data || []);
      setHorarios(h.data || []);
      setBloqueadas(new Set((b.data || []).map((x) => x.fecha)));
      if (s.data?.length) setServicio(s.data[0]);
      setDatosListos(true);
    });
  }, []);

  const diasAbiertos = useMemo(
    () => new Set(horarios.map((h) => h.dia_semana)),
    [horarios]
  );

  const estadoDia = (iso) => {
    if (iso < hoy) return "pasado";
    if (!diasAbiertos.has(deISO(iso).getDay())) return "cerrado";
    if (bloqueadas.has(iso)) return "bloqueado";
    return "libre";
  };


  useEffect(() => {
    if (!datosListos || fecha) return;
    const base = new Date();
    for (let i = 0; i <= 365; i++) {
      const d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + i);
      const iso = aISO(d);
      if (estadoDia(iso) === "libre") {
        setFecha(iso);
        setMes({ y: d.getFullYear(), m: d.getMonth() });
        break;
      }
    }
  
  }, [datosListos]);

  useEffect(() => {
    if (!fecha) return;
    let activo = true;
    setHora(null);
    supabase.rpc("horas_ocupadas", { p_fecha: fecha }).then(({ data }) => {
      if (activo) setOcupadas(data || []);
    });
    return () => { activo = false; };
  }, [fecha]);

  const celdas = useMemo(() => {
    const primero = new Date(mes.y, mes.m, 1);
    const total = new Date(mes.y, mes.m + 1, 0).getDate();
    const out = Array(primero.getDay()).fill(null);
    for (let d = 1; d <= total; d++) out.push(aISO(new Date(mes.y, mes.m, d)));
    return out;
  }, [mes]);

  const indiceMes = mes.y * 12 + mes.m;
  const puedeAtras = indiceMes > mesActual;
  const puedeAdelante = indiceMes < mesActual + MESES_ADELANTE;

  const moverMes = (delta) => {
    const i = indiceMes + delta;
    setMes({ y: Math.floor(i / 12), m: i % 12 });
  };

  const estadoFecha = fecha ? estadoDia(fecha) : null;

  const slots = useMemo(() => {
    if (!fecha || !servicio || estadoFecha !== "libre") return [];
    const dur = servicio.duracion_minutos;
    const esHoy = fecha === hoy;
    const n = new Date();
    const minAhora = n.getHours() * 60 + n.getMinutes();
    const out = [];

    horarios
      .filter((h) => h.dia_semana === deISO(fecha).getDay())
      .forEach((b) => {
        const fin = aMin(b.hora_fin);
        for (let t = aMin(b.hora_inicio); t + dur <= fin; t += PASO_MIN) {
          if (esHoy && t <= minAhora) continue;
          const choca = ocupadas.some(
            (o) => t < aMin(o.hora_fin) && t + dur > aMin(o.hora_inicio)
          );
          out.push({ min: t, libre: !choca });
        }
      });
    return out;
  }, [fecha, servicio, horarios, ocupadas, estadoFecha, hoy]);

  const elegirArchivo = (e) => {
    const f = e.target.files[0];
    setError("");
    if (!f) return setArchivo(null);
    const validos = ["image/jpeg", "image/png", "application/pdf"];
    if (!validos.includes(f.type)) return setError("Sube un JPG, PNG o PDF");
    if (f.size > 5 * 1024 * 1024) return setError("El archivo pesa más de 5 MB");
    setArchivo(f);
  };

  const confirmar = async () => {
    setError("");
    setCargando(true);
    try {
      const ext = archivo.name.split(".").pop().toLowerCase();
      const ruta = `${user.id}/${uuid()}.${ext}`;

      const { error: e1 } = await supabase.storage.from("comprobantes").upload(ruta, archivo);
      if (e1) throw e1;

      const { error: e2 } = await supabase.rpc("crear_reserva", {
        p_servicio_id: servicio.id,
        p_fecha: fecha,
        p_hora: aTime(hora),
        p_comprobante: ruta,
      });
      if (e2) throw e2;

      setListo(true);
    } catch (err) {
      setError(err.message || "No se pudo guardar la cita");
    } finally {
      setCargando(false);
    }
  };

  const d = fecha ? deISO(fecha) : null;
  const fechaTexto = d && hora !== null
    ? `${DIAS_CORTO[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()]} · ${formatoHora(hora)}`
    : "";
  const total = servicio ? Number(servicio.precio) : 0;

  return (
    <div className="rv-overlay" onClick={onClose}>
      <div className="rv" onClick={(e) => e.stopPropagation()}>
        <button className="rv-close" onClick={onClose} aria-label="Cerrar">✕</button>

        <span className="rv-eyebrow">Nueva cita</span>
        <h2>Aparta tu lugar</h2>

        {listo ? (
          <div className="rv-listo">
            <div className="rv-check">✓</div>
            <h3>¡Cita enviada!</h3>
            <p>
              Recibimos tu comprobante. Dave validará tu anticipo y confirmará tu cita
              para el <b>{fechaTexto}</b>.
            </p>
            <button className="rv-btn" onClick={() => { onClose(); navigate("/cuenta"); }}>
              Ver mis citas <Flecha />
            </button>
          </div>
        ) : (
          <>
            <div className="rv-barra">
              {[1, 2, 3].map((n) => <span key={n} className={paso >= n ? "on" : ""} />)}
            </div>

            {paso === 1 && (
              <>
                <h3>¿Qué servicio necesitas?</h3>
                <div className="rv-lista">
                  {servicios.map((s) => (
                    <button
                      key={s.id}
                      className={`rv-servicio ${servicio?.id === s.id ? "sel" : ""}`}
                      onClick={() => setServicio(s)}
                    >
                      <div>
                        <strong>{s.nombre}</strong>
                        <small>{s.duracion_minutos} min</small>
                      </div>
                      <b>${Number(s.precio)}</b>
                    </button>
                  ))}
                </div>
                <button className="rv-btn" disabled={!servicio} onClick={() => setPaso(2)}>
                  Elegir fecha y hora <Flecha />
                </button>
              </>
            )}

            {paso === 2 && (
              <>
                <h3>Elige un horario</h3>
                <p className="rv-sub">Selecciona el día y después una hora disponible.</p>

                <div className="rv-cal">
                  <div className="rv-cal-top">
                    <button disabled={!puedeAtras} onClick={() => moverMes(-1)} aria-label="Mes anterior">‹</button>
                    <b>{MESES[mes.m]} {mes.y}</b>
                    <button disabled={!puedeAdelante} onClick={() => moverMes(1)} aria-label="Mes siguiente">›</button>
                  </div>

                  <div className="rv-cal-grid">
                    {DIAS_INICIAL.map((l, i) => <span key={i} className="rv-cal-dow">{l}</span>)}

                    {celdas.map((iso, i) => {
                      if (!iso) return <span key={`v${i}`} />;
                      const est = estadoDia(iso);
                      const deshabilitado = est === "pasado" || est === "cerrado";
                      return (
                        <button
                          key={iso}
                          disabled={deshabilitado}
                          className={`rv-cal-dia ${est} ${fecha === iso ? "sel" : ""} ${iso === hoy ? "hoy" : ""}`}
                          onClick={() => setFecha(iso)}
                        >
                          {Number(iso.slice(8))}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="rv-leyenda">
                  <span><i className="verde" /> Disponible</span>
                  <span><i className="rojo" /> Sin citas</span>
                  <span><i /> Cerrado</span>
                </div>

                {estadoFecha === "bloqueado" ? (
                  <p className="rv-sinc">No hay citas disponibles este día. Elige otra fecha.</p>
                ) : slots.length === 0 ? (
                  <p className="rv-sinc">No hay citas disponibles este día. Elige otra fecha.</p>
                ) : (
                  <div className="rv-slots">
                    {slots.map((s) => (
                      <button
                        key={s.min}
                        disabled={!s.libre}
                        className={`rv-slot ${hora === s.min ? "sel" : ""} ${!s.libre ? "ocupado" : ""}`}
                        onClick={() => setHora(s.min)}
                      >
                        {formatoHora(s.min)}
                        {!s.libre && <small>Ocupado</small>}
                      </button>
                    ))}
                  </div>
                )}

                <div className="rv-acciones">
                  <button className="rv-atras" onClick={() => setPaso(1)}>← Atrás</button>
                  <button className="rv-btn" disabled={hora === null} onClick={() => setPaso(3)}>
                    {hora === null ? "Selecciona una hora disponible" : "Continuar"} <Flecha />
                  </button>
                </div>
              </>
            )}

            {paso === 3 && (
              <>
                <h3>Confirma tu cita</h3>

                <div className="rv-resumen">
                  <div><span>Servicio</span><b>{servicio.nombre}</b></div>
                  <div><span>Fecha</span><b>{fechaTexto}</b></div>
                  <div><span>Total</span><b>${total} MXN</b></div>
                  <div className="rojo"><span>Anticipo para confirmar</span><b>${ANTICIPO} MXN</b></div>
                  <div><span>Saldo en el estudio</span><b>${Math.max(total - ANTICIPO, 0)} MXN</b></div>
                </div>

                <div className="rv-banco">
                  <strong>Transferencia bancaria</strong>
                  <small>CLABE · {CLABE}</small>
                </div>

                <p className="rv-aviso">
                  <b>Importante:</b> si cancelas tu cita, el anticipo de ${ANTICIPO} no es reembolsable.
                </p>

                <label className="rv-subir">
                  <input type="file" accept="image/jpeg,image/png,application/pdf" onChange={elegirArchivo} hidden />
                  <strong>{archivo ? archivo.name : "Subir comprobante"}</strong>
                  <small>JPG, PNG o PDF · máx. 5 MB</small>
                </label>

                {error && <p className="rv-error">{error}</p>}

                <div className="rv-acciones">
                  <button className="rv-atras" onClick={() => setPaso(2)}>← Atrás</button>
                  <button className="rv-btn" disabled={!archivo || cargando} onClick={confirmar}>
                    {cargando ? "Enviando..." : "Marcar como transferido"}
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}