import "../styles/Footer.css";
import logo from "../assets/logodave.jpeg";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <img src={logo} alt="Dave Barber Studio" />
            <p>Precisión en cada corte.<br />Atención en cada detalle.</p>
          </div>

          <div>
            <h4>Explora</h4>
            <a href="#servicios">Servicios</a>
            <a href="#portafolio">Portafolio</a>
            <a href="#productos">Productos</a>
            <a href="#contacto">Contacto</a>
          </div>

          <div>
            <h4>Horario</h4>
            <span>Mar–Sab · 10:00 AM–08:00 PM</span>
            <span>Domingo · 12:00 PM–06:00 PM</span>
            <span>Lun · Cerrado</span>
          </div>

          <div>
            <h4>Contacto</h4>
            <span>WhatsApp · 2871554566</span>
            <span>Libertad 34, Agencia de Policia Esquipulas, 71232 Santa Cruz Xoxocotlán, Oax.</span>
          </div>
        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} Dave Barber Studio. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}