import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { useReserva } from "../context/ReservaContext";
import "../styles/servicios.css";

export default function Servicios() {
  const [servicios, setServicios] = useState([]);
  const [pagina, setPagina] = useState(0);
  const pista = useRef(null);
  const { user } = useAuth();
  const { abrirReserva } = useReserva();
  const esAdmin = user?.rol === "admin";

  useEffect(() => {
    supabase
      .from("servicios")
      .select("*")
      .eq("activo", true)
      .order("id")
      .then(({ data }) => setServicios(data || []));
  }, []);

  const mover = (dir) => {
    const el = pista.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth, behavior: "smooth" });
  };

  const alScroll = () => {
    const el = pista.current;
    if (!el) return;
    setPagina(Math.round(el.scrollLeft / el.clientWidth));
  };

  const irA = (i) => {
    const el = pista.current;
    el?.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  const paginas = pista.current
    ? Math.max(1, Math.round(pista.current.scrollWidth / pista.current.clientWidth))
    : 1;

  return (
    <section className="services">
      <div className="services-header">
        <h2>
          Simple, claro, <span>sin sorpresas.</span>
        </h2>

        <p>
          Elige tu servicio. Todos incluyen asesoría de estilo y acabado
          profesional.
        </p>
      </div>

      <div className="services-carrusel">
        <button className="srv-flecha izq" onClick={() => mover(-1)} aria-label="Anterior">‹</button>

        <div className="services-pista" ref={pista} onScroll={alScroll}>
          {servicios.map((s, index) => (
            <div className="service-card" key={s.id}>
              <img src={s.imagen_url} alt={s.nombre} />

              <div className="service-content">
                <span className="service-number">0{index + 1}</span>

                <p className="service-label">SERVICIO</p>

                <h3>{s.nombre}</h3>

                <div className="service-info">
                  <span className="price">${Number(s.precio)}</span>
                  <span>{s.duracion_minutos} min</span>
                </div>

                {!esAdmin && (
                  <button onClick={abrirReserva}>
                    Elegir servicio
                    <span>→</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <button className="srv-flecha der" onClick={() => mover(1)} aria-label="Siguiente">›</button>
      </div>

      {paginas > 1 && (
        <div className="services-puntos">
          {Array.from({ length: paginas }).map((_, i) => (
            <button
              key={i}
              className={i === pagina ? "on" : ""}
              onClick={() => irA(i)}
              aria-label={`Página ${i + 1}`}
            />
          ))}
        </div>
      )}

      <div className="services-note">
        Tu cita queda protegida. Se requiere un anticipo de $100 por
        transferencia para confirmar.
      </div>
    </section>
  );
}