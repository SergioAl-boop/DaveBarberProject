import { createClient } from "npm:@supabase/supabase-js@2";
import webpush from "npm:web-push@3.6.7";

webpush.setVapidDetails(
  Deno.env.get("VAPID_SUBJECT")!,
  Deno.env.get("VAPID_PUBLIC")!,
  Deno.env.get("VAPID_PRIVATE")!
);

Deno.serve(async (req) => {
  const { record } = await req.json();

  const sb = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const [{ data: subs }, { data: perfil }] = await Promise.all([
    sb.from("push_subscriptions").select("*").eq("usuario_id", record.usuario_id),
    sb.from("perfiles").select("rol").eq("id", record.usuario_id).single(),
  ]);

  const payload = JSON.stringify({
    titulo: record.titulo,
    mensaje: record.mensaje,
    url: perfil?.rol === "admin" ? "/admin/agenda" : "/cuenta",
  });

  await Promise.all(
    (subs || []).map(async (s) => {
      try {
        await webpush.sendNotification(
          { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
          payload
        );
      } catch (err) {
        if (err.statusCode === 404 || err.statusCode === 410) {
          await sb.from("push_subscriptions").delete().eq("id", s.id);
        }
      }
    })
  );

  return new Response("ok");
});