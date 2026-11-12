import { supabase } from "./supabase";
import { uuid } from "./uuid";

export async function subirImagen(archivo, carpeta) {
  
  const ext = archivo.name.split(".").pop();
  const ruta = `${carpeta}/${uuid()}.${ext}`;
  const { error } = await supabase.storage.from("imagenes").upload(ruta, archivo);
  if (error) throw error;
  return supabase.storage.from("imagenes").getPublicUrl(ruta).data.publicUrl;
}