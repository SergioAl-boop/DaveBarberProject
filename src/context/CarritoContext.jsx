import { createContext, useContext, useEffect, useState } from "react";
import CarritoModal from "../components/CarritoModal";

const CarritoContext = createContext(null);
const CLAVE = "carrito";

const leer = () => {
  try { return JSON.parse(sessionStorage.getItem(CLAVE)) || []; }
  catch { return []; }
};

export function CarritoProvider({ children }) {
  const [items, setItems] = useState(leer);
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    try { sessionStorage.setItem(CLAVE, JSON.stringify(items)); } catch { /* ignorar */ }
  }, [items]);

  const agregar = (p) =>
    setItems((prev) => {
      const ya = prev.find((i) => i.id === p.id);
      if (ya) {
        return prev.map((i) =>
          i.id === p.id ? { ...i, cantidad: Math.min(i.cantidad + 1, p.stock) } : i
        );
      }
      return [...prev, {
        id: p.id, nombre: p.nombre, precio: Number(p.precio),
        imagen_url: p.imagen_url, stock: p.stock, cantidad: 1,
      }];
    });

  const cambiar = (id, delta) =>
    setItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, cantidad: Math.min(i.cantidad + delta, i.stock) } : i))
        .filter((i) => i.cantidad > 0)
    );

  const quitar = (id) => setItems((prev) => prev.filter((i) => i.id !== id));
  const vaciar = () => setItems([]);

  const cantidad = items.reduce((s, i) => s + i.cantidad, 0);
  const total = items.reduce((s, i) => s + i.cantidad * i.precio, 0);

  return (
    <CarritoContext.Provider
      value={{ items, agregar, cambiar, quitar, vaciar, cantidad, total,
               abrir: () => setAbierto(true) }}
    >
      {children}
      {abierto && <CarritoModal onClose={() => setAbierto(false)} />}
    </CarritoContext.Provider>
  );
}

export const useCarrito = () => useContext(CarritoContext);