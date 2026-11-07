import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { subirImagen } from "../../lib/subirImagen";
import Encabezado from "./Encabezado";

const vacio = { nombre: "", descripcion: "", precio: "", duracion_minutos: 30 };

export default function ServiciosAdmin() {
  const [lista, setLista] = useState([]);
  const [form, setForm] = useState(vacio);
  const [archivo, setArchivo] = useState(null);
  const [editId, setEditId] = useState(null);
  const [fileKey, setFileKey] = useState(0);
  const [msg, setMsg] = useState("");
  const [cargando, setCargando] = useState(false);

  const cargar = async () => {
    const { data } = await supabase.from("servicios").select("*").order("id");
    setLista(data || []);
  };
  useEffect(() => { cargar(); }, []);

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const limpiar = () => {
    setForm(vacio);
    setArchivo(null);
    setEditId(null);
    setFileKey((k) => k + 1);
  };

  const guardar = async (e) => {
    e.preventDefault();
    setMsg("");
    setCargando(true);
    try {
      const datos = {
        nombre: form.nombre,
        descripcion: form.descripcion,
        precio: Number(form.precio),
        duracion_minutos: Number(form.duracion_minutos),
      };
      if (archivo) datos.imagen_url = await subirImagen(archivo, "servicios");

      const { error } = editId
        ? await supabase.from("servicios").update(datos).eq("id", editId)
        : await supabase.from("servicios").insert(datos);
      if (error) throw error;

      setMsg(editId ? " Servicio actualizado" : " Servicio agregado");
      limpiar();
      cargar();
    } catch (err) {
      setMsg("❌ " + err.message);
    } finally {
      setCargando(false);
    }
  };

  const editar = (s) => {
    setEditId(s.id);
    setForm({
      nombre: s.nombre,
      descripcion: s.descripcion || "",
      precio: s.precio,
      duracion_minutos: s.duracion_minutos,
    });
    setArchivo(null);
    setFileKey((k) => k + 1);
    setMsg("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const alternar = async (s) => {
    const { error } = await supabase
      .from("servicios")
      .update({ activo: !s.activo })
      .eq("id", s.id);
    if (error) setMsg("❌ " + error.message);
    else cargar();
  };

  const borrar = async (s) => {
    if (!confirm(`¿Eliminar "${s.nombre}" definitivamente?`)) return;
    const { error } = await supabase.from("servicios").delete().eq("id", s.id);
    if (error) {
      setMsg(
        error.code === "23503"
          ? " Este servicio ya tiene citas registradas. Mejor ocúltalo para conservar el historial."
          : "❌ " + error.message
      );
    } else {
      if (editId === s.id) limpiar();
      cargar();
    }
  };

  return (
    <>
      <Encabezado
        titulo="Servicios"
        texto="Administra los cortes, precios y duraciones que ven tus clientes."
      />

      <div className="admin-card">
        <h2>{editId ? "Editar servicio" : "Agregar servicio"}</h2>

        <form onSubmit={guardar}>
          <input name="nombre" placeholder="Nombre (ej. Taper fade)" value={form.nombre} onChange={cambiar} required />
          <input name="descripcion" placeholder="Descripción corta" value={form.descripcion} onChange={cambiar} />
          <input name="precio" type="number" min="0" step="0.01" placeholder="Precio" value={form.precio} onChange={cambiar} required />
          <input name="duracion_minutos" type="number" min="5" step="5" placeholder="Duración en minutos" value={form.duracion_minutos} onChange={cambiar} required />
          <input key={fileKey} type="file" accept="image/*" onChange={(e) => setArchivo(e.target.files[0] || null)} />
          {editId && <small className="admin-hint">Deja la foto vacía para conservar la actual.</small>}

          <div className="admin-botones">
            <button disabled={cargando}>
              {cargando ? "Guardando..." : editId ? "Guardar cambios" : "Agregar"}
            </button>
            {editId && <button type="button" className="gris" onClick={limpiar}>Cancelar</button>}
          </div>
          {msg && <p className="admin-msg">{msg}</p>}
        </form>

        <h2>Catálogo ({lista.length})</h2>
        <ul className="admin-lista">
          {lista.map((s) => (
            <li key={s.id} className={s.activo ? "" : "oculto"}>
              {s.imagen_url && <img src={s.imagen_url} alt="" />}
              <span>
                {s.nombre} · ${Number(s.precio)}
                <small>
                  {s.duracion_minutos} min{!s.activo && " · Oculto"}
                </small>
              </span>
              <button className="gris" onClick={() => editar(s)}>Editar</button>
              <button className="gris" onClick={() => alternar(s)}>
                {s.activo ? "Ocultar" : "Mostrar"}
              </button>
              <button onClick={() => borrar(s)}>Eliminar</button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}