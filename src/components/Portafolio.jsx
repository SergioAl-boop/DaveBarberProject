import { useState } from "react";
import "../styles/Portafolio.css";

const cortes = [
  { id: 1, nombre: "Skin fade", cat: "fade", img: "https://cdn.shopify.com/s/files/1/0029/0868/4397/files/french-crop-skin-fade-haircut-men.png?v=1757673694" },
  { id: 2, nombre: "Corte clásico", cat: "básico", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEMMvdOs2yVRSc8ack-jwRh9XW1KbJFBO4n4ek4y5_vQFjoMulUHvwkveJ&s=10" },
  { id: 3, nombre: "Barba definida", cat: "barba", img: "https://i.ytimg.com/vi/I559LMpDmx0/maxresdefault.jpg" },
  { id: 4, nombre: "Taper fade", cat: "fade", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQynbBg-Ch56wfYfLtFidutkKW_BKJGMdABq3qAgKf9lwt62o78B6PPjj0&s=10" },
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