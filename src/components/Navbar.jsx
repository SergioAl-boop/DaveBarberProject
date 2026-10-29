import { useState } from "react";
import "../styles/Navbar.css";
import logo from "../assets/logodave.jpeg";
import LoginModal from "./LoginModal";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
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
            <button onClick={() => { close(); setLoginOpen(true); }}>
              Iniciar sesión
            </button>
          </li>
        </ul>

        <div className="nav-actions">
          <button className="login" onClick={() => setLoginOpen(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
            </svg>
            Iniciar sesión
          </button>

          <button className="btn-reservar">Reservar cita</button>
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

      {loginOpen && <LoginModal onClose={() => setLoginOpen(false)} />}
    </>
  );
}