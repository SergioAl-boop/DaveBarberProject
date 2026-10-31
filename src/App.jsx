import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import RutaAdmin from "./components/RutaAdmin";
import AdminLayout from "./components/AdminLayout";
import Resumen from "./pages/admin/Resumen";
import Proximamente from "./pages/admin/Proximamente";
import { AdminProductos, AdminPortafolio } from "./pages/admin/Catalogos";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/admin" element={<RutaAdmin><AdminLayout /></RutaAdmin>}>
        <Route index element={<Resumen />} />
        <Route path="agenda" element={<Proximamente titulo="Agenda" />} />
        <Route path="clientes" element={<Proximamente titulo="Clientes" />} />
        <Route path="servicios" element={<Proximamente titulo="Servicios" />} />
        <Route path="productos" element={<AdminProductos />} />
        <Route path="portafolio" element={<AdminPortafolio />} />
      </Route>
    </Routes>
  );
}

export default App;