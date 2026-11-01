import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BotonNotificaciones from "./BotonNotificaciones";
import logo from "../assets/logodave.jpeg";
import "../styles/Admin.css";

const Icono = ({ children }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    {children}
  </svg>
);

const menu = [
  { to: "/admin", label: "Resumen", end: true,
    icono: <Icono><path d="M4 20V10M10 20V4M16 20v-8M22 20H2" /></Icono> },
  { to: "/admin/agenda", label: "Agenda",
    icono: <Icono><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></Icono> },
  { to: "/admin/clientes", label: "Clientes",
    icono: <Icono><circle cx="9" cy="8" r="3.5" /><path d="M2 20c0-3.5 3-5.5 7-5.5s7 2 7 5.5M16 4.5a3.5 3.5 0 0 1 0 7M18 14.8c2.2.6 4 2.2 4 5.2" /></Icono> },
  { to: "/admin/servicios", label: "Servicios",
    icono: <Icono><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M8.5 8l11 11M8.5 16l11-11" /></Icono> },
  { to: "/admin/productos", label: "Productos",
    icono: <Icono><path d="M5 8h14l-1 12H6L5 8zM9 8V6a3 3 0 0 1 6 0v2" /></Icono> },
  { to: "/admin/portafolio", label: "Portafolio",
    icono: <Icono><path d="M12 16V4M7 9l5-5 5 5M4 20h16" /></Icono> },
];

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const salir = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="adm">
      <aside className="adm-side">
        <img className="adm-logo" src={logo} alt="Dave Barber Studio" />
        <span className="adm-badge">Administrador</span>

        <nav className="adm-nav">
          {menu.map((m) => (
            <NavLink key={m.to} to={m.to} end={m.end}>
              {m.icono}
              {m.label}
            </NavLink>
          ))}
        </nav>

        <BotonNotificaciones className="adm-salir" />
        <button className="adm-salir adm-salir-final" onClick={salir}>Cerrar sesión</button>
      </aside>

      <main className="adm-main">
        <Outlet />
      </main>
    </div>
  );
}