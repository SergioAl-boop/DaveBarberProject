import { createClient } from "npm:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const responder = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  const { email, telefono, password } = await req.json();
  const correo = String(email || "").trim().toLowerCase();
  const tel = String(telefono || "").replace(/\D/g, "");

  if (!/^\S+@\S+\.\S+$/.test(correo) || tel.length !== 10)
    return responder({ error: "Datos incorrectos" }, 400);
  if (typeof password !== "string" || password.length < 8)
    return responder({ error: "La contraseña debe tener al menos 8 caracteres" }, 400);

  const sb = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const desde = new Date(Date.now() - 15 * 60 * 1000).toISOString();
  const { count } = await sb.from("intentos_password")
    .select("id", { count: "exact", head: true })
    .eq("email", correo).gte("creado_en", desde);
  if ((count ?? 0) >= 5)
    return responder({ error: "Demasiados intentos. Espera unos minutos." }, 429);
  await sb.from("intentos_password").insert({ email: correo });


  const { data: perfiles } = await sb.from("perfiles")
    .select("id").eq("telefono", tel).eq("rol", "cliente");

  let objetivo: string | null = null;
  for (const p of perfiles || []) {
    const { data } = await sb.auth.admin.getUserById(p.id);
    if (data?.user?.email?.toLowerCase() === correo) { objetivo = p.id; break; }
  }
  if (!objetivo) return responder({ error: "Correo o teléfono incorrectos" }, 400);

  const { error } = await sb.auth.admin.updateUserById(objetivo, { password });
  if (error) return responder({ error: error.message }, 500);

  return responder({ ok: true });
});