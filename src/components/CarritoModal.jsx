import { useState } from "react";
import { supabase } from "../lib/supabase";
import { uuid } from "../lib/uuid";
import { useAuth } from "../context/AuthContext";
import { useCarrito } from "../context/CarritoContext";
import { useReserva } from "../context/ReservaContext";
import "../styles/Carrito.css";

const CLABE = "5428 7851 0417 4759";

export default function CarritoModal({ onClose }) {
  const { user } = useAuth();
  const { abrirLogin } = useReserva();
  const { items, cambiar, quitar, vaciar, total } = useCarrito();

  const [archivo, setArchivo] = useState(null);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [listo, setListo] = useState(false);

  const elegirArchivo = (e) => {
    const f = e.target.files[0];
    setError("");
    if (!f) return setArchivo(null);
    if (!["image/jpeg", "image/png", "application/pdf"].includes(f.type))
      return setError("Sube un JPG, PNG o PDF");
    if (f.size > 5 * 1024 * 1024) return setError("El archivo pesa más de 5 MB");
    setArchivo(f);
  };

  const iniciarSesion = () => {
    onClose();
    abrirLogin();
  };

  const apartar = async () => {
    setError("");
    setCargando(true);
    try {
      const ext = archivo.name.split(".").pop().toLowerCase();
      const ruta = `${user.id}/pedido-${uuid()}.${ext}`;

      const { error: e1 } = await supabase.storage.from("comprobantes").upload(ruta, archivo);
      if (e1) throw e1;

      const { error: e2 } = await supabase.rpc("crear_pedido", {
        p_items: items.map((i) => ({ id: i.id, cantidad: i.cantidad })),
        p_comprobante: ruta,
      });
      if (e2) throw e2;

      vaciar();
      setListo(true);
    } catch (err) {
      setError(err.message || "No se pudo apartar");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="rv-overlay" onClick={onClose}>
      <div className="rv" onClick={(e) => e.stopPropagation()}>
        <button className="rv-close" onClick={onClose} aria-label="Cerrar">✕</button>

        <span className="rv-eyebrow">Tienda</span>
        <h2>Tu carrito</h2>

        {listo ? (
          <div className="rv-listo">
            <div className="rv-check">✓</div>
            <h3>¡Apartado enviado!</h3>
            <p>
              Recibimos tu comprobante. Dave lo validará y te avisará cuando
              puedas recoger tu pedido en el estudio.
            </p>
            <button className="rv-btn" onClick={onClose}>Cerrar</button>
          </div>
        ) : items.length === 0 ? (
          <p className="rv-vacio">Tu carrito está vacío.</p>
        ) : (
          <>
            <ul className="cr-lista">
              {items.map((i) => (
                <li key={i.id}>
                  {i.imagen_url && <img src={i.imagen_url} alt="" />}
                  <div className="cr-info">
                    <b>{i.nombre}</b>
                    <small>${i.precio} c/u</small>
                  </div>
                  <div className="cr-cant">
                    <button onClick={() => cambiar(i.id, -1)} aria-label="Menos">−</button>
                    <span>{i.cantidad}</span>
                    <button
                      onClick={() => cambiar(i.id, 1)}
                      disabled={i.cantidad >= i.stock}
                      aria-label="Más"
                    >+</button>
                  </div>
                  <button className="cr-quitar" onClick={() => quitar(i.id)} aria-label="Quitar">✕</button>
                </li>
              ))}
            </ul>

            <div className="rv-resumen">
              <div className="rojo"><span>Total a transferir</span><b>${total} MXN</b></div>
            </div>

            {!user ? (
              <button className="rv-btn" onClick={iniciarSesion}>
                Inicia sesión para apartar
              </button>
            ) : (
              <>
                <div className="rv-banco">
                  <strong>Transferencia bancaria</strong>
                  <small>CLABE · {CLABE}</small>
                </div>

                <p className="rv-aviso">
                  <b>Importante:</b> el producto se aparta al enviar tu comprobante y
                  se recoge en el estudio una vez que Dave valide el pago.
                </p>

                <label className="rv-subir">
                  <input type="file" accept="image/jpeg,image/png,application/pdf"
                         onChange={elegirArchivo} hidden />
                  <strong>{archivo ? archivo.name : "Subir comprobante"}</strong>
                  <small>JPG, PNG o PDF · máx. 5 MB</small>
                </label>

                {error && <p className="rv-error">{error}</p>}

                <button className="rv-btn" disabled={!archivo || cargando} onClick={apartar}>
                  {cargando ? "Enviando..." : "Apartar con transferencia"}
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}