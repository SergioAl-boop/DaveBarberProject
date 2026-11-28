import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./lib/supabase"  
import { iniciarOneSignal } from "./lib/onesignal";

import Home from "./pages/Home";
import Cuenta from "./pages/Cuenta";
import RutaAdmin from "./components/RutaAdmin";
import RutaCliente from "./components/RutaCliente";
import AdminLayout from "./components/AdminLayout";
import Resumen from "./pages/admin/Resumen"
import { AdminProductos, AdminPortafolio } from "./pages/admin/Catalogos";
import Agenda from "./pages/admin/Agenda";
import Clientes from "./pages/admin/Clientes";
import ServiciosAdmin from "./pages/admin/ServiciosAdmin";
import Pedidos from "./pages/admin/Pedidos";
import Restablecer from "./pages/Restablecer";
import Disponibilidad from "./pages/admin/Disponibilidad";


function App() {

  useEffect(() => {
   
    supabase.auth.getSession().then(({ data: { session } }) => {
      iniciarOneSignal(session?.user?.id);
    });

    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.id) {
        iniciarOneSignal(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/restablecer" element={<Restablecer />} />
      <Route path="/cuenta" element={<RutaCliente><Cuenta /></RutaCliente>} />

      <Route path="/admin" element={<RutaAdmin><AdminLayout /></RutaAdmin>}>
        <Route index element={<Resumen />} />
        <Route path="agenda" element={<Agenda />} />
        <Route path="disponibilidad" element={<Disponibilidad />} />
        <Route path="clientes" element={<Clientes />} />
        <Route path="servicios" element={<ServiciosAdmin />} />
        <Route path="productos" element={<AdminProductos />} />
        <Route path="portafolio" element={<AdminPortafolio />} />
        <Route path="pedidos" element={<Pedidos />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;