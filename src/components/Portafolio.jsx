import { useState } from "react";
import "../styles/Portafolio.css";

const cortes = [
  { id: 1, nombre: "Skin fade", cat: "fade", img: "/portafolio/skin-fade.jpg" },
  { id: 2, nombre: "Corte clásico", cat: "básico", img: "/portafolio/clasico.jpg" },
  { id: 3, nombre: "Barba definida", cat: "barba", img: "/portafolio/barba.jpg" },
  { id: 4, nombre: "Taper fade", cat: "fade", img: "/portafolio/taper-fade.jpg" },
];

const filtros = ["todos", "fade", "básico", "barba"];

export default function Portafolio() {
  const [filtro, setFiltro] = useState("todos");
  const visibles = filtro === "todos" ? cortes : cortes.filter(c => c.cat === filtro);

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
            {filtros.map(f => (
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

        <div className={`portafolio-grid ${filtro === "todos" ? "full" : ""}`}>
          {visibles.map(c => (
            <article key={c.id} className="corte">
              <img src={c.img} alt={c.nombre} />
              <span className="corte-num">0{c.id}</span>
              <div className="corte-info">
                <h3>{c.nombre}</h3>
                <small>{c.cat}</small>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}