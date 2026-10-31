import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import Encabezado from "./Encabezado";

async function subirImagen(archivo, carpeta) {
  const ext = archivo.name.split(".").pop();
  const ruta = `${carpeta}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("imagenes").upload(ruta, archivo);
  if (error) throw error;
  return supabase.storage.from("imagenes").getPublicUrl(ruta).data.publicUrl;
}

export function FormPortafolio() {
  const [lista, setLista] = useState([]);
  const [form, setForm] = useState({ nombre: "", categoria: "fade" });
  const [archivo, setArchivo] = useState(null);
  const [msg, setMsg] = useState("");
  const [cargando, setCargando] = useState(false);

  const cargar = async () => {
    const { data } = await supabase.from("portafolio").select("*").order("id");
    setLista(data || []);
  };
  useEffect(() => { cargar(); }, []);

  const guardar = async (e) => {
    e.preventDefault();
    const formulario = e.target;
    setMsg("");
    setCargando(true);
    try {
      const imagen_url = await subirImagen(archivo, "portafolio");
      const { error } = await supabase.from("portafolio").insert({ ...form, imagen_url });
      if (error) throw error;
      setMsg("✅ Guardado");
      setForm({ nombre: "", categoria: "fade" });
      setArchivo(null);
      formulario.reset();
      cargar();
    } catch (err) {
      setMsg("❌ " + err.message);
    } finally {
      setCargando(false);
    }
  };

  const borrar = async (id) => {
    if (!confirm("¿Eliminar este corte?")) return;
    const { error } = await supabase.from("portafolio").delete().eq("id", id);
    if (error) setMsg("❌ " + error.message);
    else cargar();
  };

  return (
    <div className="admin-card">
      <h2>Portafolio</h2>
      <form onSubmit={guardar}>
        <input
          placeholder="Nombre (ej. Skin fade)"
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          required
        />
        <select
          value={form.categoria}
          onChange={(e) => setForm({ ...form, categoria: e.target.value })}
        >
          <option value="fade">Fade</option>
          <option value="básico">Básico</option>
          <option value="barba">Barba</option>
        </select>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setArchivo(e.target.files[0])}
          required
        />
        <button disabled={cargando}>{cargando ? "Guardando..." : "Agregar"}</button>
        {msg && <p className="admin-msg">{msg}</p>}
      </form>

      <ul className="admin-lista">
        {lista.map((c) => (
          <li key={c.id}>
            <img src={c.imagen_url} alt="" />
            <span>{c.nombre} · {c.categoria}</span>
            <button onClick={() => borrar(c.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function FormProductos() {
  const vacio = { nombre: "", detalle: "", precio: "", stock: 0 };
  const [lista, setLista] = useState([]);
  const [form, setForm] = useState(vacio);
  const [archivo, setArchivo] = useState(null);
  const [msg, setMsg] = useState("");
  const [cargando, setCargando] = useState(false);

  const cargar = async () => {
    const { data } = await supabase.from("productos").select("*").order("id");
    setLista(data || []);
  };
  useEffect(() => { cargar(); }, []);

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const guardar = async (e) => {
    e.preventDefault();
    const formulario = e.target;
    setMsg("");
    setCargando(true);
    try {
      const imagen_url = archivo ? await subirImagen(archivo, "productos") : null;
      const { error } = await supabase.from("productos").insert({
        nombre: form.nombre,
        detalle: form.detalle,
        precio: Number(form.precio),
        stock: Number(form.stock),
        imagen_url,
      });
      if (error) throw error;
      setMsg("✅ Guardado");
      setForm(vacio);
      setArchivo(null);
      formulario.reset();
      cargar();
    } catch (err) {
      setMsg("❌ " + err.message);
    } finally {
      setCargando(false);
    }
  };

  const borrar = async (id) => {
    if (!confirm("¿Eliminar este producto?")) return;
    const { error } = await supabase.from("productos").delete().eq("id", id);
    if (error) setMsg("❌ " + error.message);
    else cargar();
  };

  return (
    <div className="admin-card">
      <h2>Productos</h2>
      <form onSubmit={guardar}>
        <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={cambiar} required />
        <input name="detalle" placeholder="Detalle (ej. Fijación · 100 g)" value={form.detalle} onChange={cambiar} />
        <input name="precio" type="number" step="0.01" min="0" placeholder="Precio" value={form.precio} onChange={cambiar} required />
        <input name="stock" type="number" min="0" placeholder="Stock" value={form.stock} onChange={cambiar} />
        <input type="file" accept="image/*" onChange={(e) => setArchivo(e.target.files[0])} />
        <button disabled={cargando}>{cargando ? "Guardando..." : "Agregar"}</button>
        {msg && <p className="admin-msg">{msg}</p>}
      </form>

      <ul className="admin-lista">
        {lista.map((p) => (
          <li key={p.id}>
            {p.imagen_url && <img src={p.imagen_url} alt="" />}
            <span>{p.nombre} · ${p.precio}</span>
            <button onClick={() => borrar(p.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AdminPortafolio() {
  return (
    <>
      <Encabezado titulo="Portafolio" texto="Sube y administra los cortes que se ven en el sitio." />
      <FormPortafolio />
    </>
  );
}

export function AdminProductos() {
  return (
    <>
      <Encabezado titulo="Productos" texto="Administra la tienda del estudio." />
      <FormProductos />
    </>
  );
}