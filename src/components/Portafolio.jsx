import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import "../styles/Portafolio.css";

const filtros = ["todos", "fade", "básico", "barba"];

export default function Portafolio() {
  const [cortes, setCortes] = useState([]);
  const [filtro, setFiltro] = useState("todos");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    supabase
      .from("portafolio")
      .select("*")
      .eq("activo", true)
      .order("orden", { ascending: true })
      .order("id", { ascending: true })
      .then(({ data, error }) => {
        if (error) console.error(error);
        else setCortes(data || []);
        setCargando(false);
      });
  }, []);

  const visibles =
    filtro === "todos" ? cortes : cortes.filter((c) => c.categoria === filtro);

  return (
    <section className="portafolio">
      <div className="container">
        <div className="portafolio-header">
          <div>
            <span className="eyebrow-dark">Portafolio</span>
            <h2>
              Inspiración para
              <span>tu próximo corte.</span>
            </h2>
          </div>

          <div className="filtros">
            {filtros.map((f) => (
              <button
                key={f}
                className={filtro === f ? "active" : ""}
                onClick={() => setFiltro(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {!cargando && visibles.length === 0 && (
          <p style={{ color: "#b8c2d6" }}>Aún no hay cortes en esta categoría.</p>
        )}

        <div className={`portafolio-grid ${filtro === "todos" ? "full" : ""}`}>
          {visibles.map((c, i) => (
            <article key={c.id} className="corte">
              <img src={c.imagen_url} alt={c.nombre} />
              <span className="corte-num">0{i + 1}</span>
              <div className="corte-info">
                <h3>{c.nombre}</h3>
                <small>{c.categoria}</small>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}