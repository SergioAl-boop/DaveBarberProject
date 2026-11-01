import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useReserva } from "../context/ReservaContext";
import "../styles/Navbar.css";
import logo from '../assets/logodave.jpeg';

const IconoUsuario = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
  </svg>
);

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { abrirLogin, abrirReserva } = useReserva();
  const close = () => setOpen(false);

  const esAdmin = user?.rol === "admin";
  const panel = esAdmin ? "/admin" : "/cuenta";
  const primerNombre = user?.nombre?.split(" ")[0] || "";

  return (
    <header className="navbar">
      <a href="#" className="logo" onClick={close}>
        <img src={logo} alt="Dave Barber Studio" />
      </a>

      <ul className={`nav-links ${open ? "open" : ""}`}>
        <li><a href="#servicios" onClick={close}>Servicios</a></li>
        <li><a href="#portafolio" onClick={close}>Portafolio</a></li>
        <li><a href="#productos" onClick={close}>Productos</a></li>
        <li><a href="#contacto" onClick={close}>Contacto</a></li>
        <li className="nav-login-mobile">
          {user ? (
            <Link to={panel} onClick={close}>Mi panel</Link>
          ) : (
            <button onClick={() => { close(); abrirLogin(); }}>Iniciar sesión</button>
          )}
        </li>
      </ul>

      <div className="nav-actions">
        {user ? (
          <>
            <Link to={panel} className="login">
              <IconoUsuario />
              Hola, {primerNombre}
            </Link>
            <button className="login" onClick={logout}>Cerrar Sesión</button>
          </>
        ) : (
          <button className="login" onClick={abrirLogin}>
            <IconoUsuario />
            Iniciar sesión
          </button>
        )}

        {!esAdmin && (
          <button className="btn-reservar" onClick={abrirReserva}>Reservar cita</button>
        )}
      </div>

      <button
        className="menu-toggle"
        aria-label="Abrir menú"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <span />
        <span />
        <span />
      </button>
    </header>
  );
}