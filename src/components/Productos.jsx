import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import "../styles/Productos.css";

const CartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="9" cy="20" r="1.5" />
    <circle cx="18" cy="20" r="1.5" />
    <path d="M2 3h3l3 12h11l2-8H6" />
  </svg>
);

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [carrito, setCarrito] = useState(0);
  const [pagina, setPagina] = useState(0);
  const pista = useRef(null);

  useEffect(() => {
    supabase
      .from("productos")
      .select("*")
      .eq("activo", true)
      .order("id")
      .then(({ data }) => {
        setProductos(data || []);
        setCargando(false);
      });
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

        {!cargando && productos.length === 0 && (
          <p className="productos-vacio">Pronto tendremos productos disponibles.</p>
        )}

        <div className="carrusel">
          <button className="flecha izq" onClick={() => mover(-1)} aria-label="Anterior">‹</button>

          <div className="pista" ref={pista} onScroll={alScroll}>
            {productos.map((p) => {
              const agotado = p.stock <= 0;
              return (
                <article key={p.id} className="producto">
                  <div className="producto-img">
                    {p.imagen_url && <img src={p.imagen_url} alt={p.nombre} />}
                    <span className={`badge ${agotado ? "agotado" : ""}`}>
                      {agotado ? "Agotado" : "Disponible"}
                    </span>
                  </div>

                  <div className="producto-body">
                    <small>{p.detalle}</small>
                    <h3>{p.nombre}</h3>

                    <div className="producto-footer">
                      <strong>${Number(p.precio)}</strong>
                      <button disabled={agotado} onClick={() => setCarrito(carrito + 1)}>
                        <CartIcon /> Agregar
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <button className="flecha der" onClick={() => mover(1)} aria-label="Siguiente">›</button>
        </div>

        {paginas > 1 && (
          <div className="puntos">
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
      </div>
    </section>
  );
}