import { useState } from "react";
import "../styles/Productos.css";

const productos = [
  { nombre: "Pomada mate", detalle: "Fijación · 100 g", precio: 280, img: "/productos/pomada.jpg" },
  { nombre: "Aceite para barba", detalle: "Cuidado · 30 ml", precio: 220, img: "/productos/aceite.jpg" },
  { nombre: "Shampoo refrescante", detalle: "Limpieza · 250 ml", precio: 190, img: "/productos/shampoo.jpg" },
];

const CartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="9" cy="20" r="1.5" />
    <circle cx="18" cy="20" r="1.5" />
    <path d="M2 3h3l3 12h11l2-8H6" />
  </svg>
);

export default function Productos() {
  const [carrito, setCarrito] = useState(0);

  return (
    <section className="productos">
      <div className="container">
        <div className="productos-header">
          <div>
            <span className="eyebrow-light">Tienda</span>
            <h2>
              Lleva el acabado <span>a casa.</span>
            </h2>
            <p>Productos seleccionados para cuidar tu estilo entre citas.</p>
          </div>

          <div className="carrito">
            <CartIcon /> Carrito
            <b>{carrito}</b>
          </div>
        </div>

        <div className="productos-grid">
          {productos.map(p => (
            <article key={p.nombre} className="producto">
              <div className="producto-img">
                <img src={p.img} alt={p.nombre} />
                <span className="badge">Disponible</span>
              </div>

              <div className="producto-body">
                <small>{p.detalle}</small>
                <h3>{p.nombre}</h3>

                <div className="producto-footer">
                  <strong>${p.precio}</strong>
                  <button onClick={() => setCarrito(carrito + 1)}>
                    <CartIcon /> Agregar
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}