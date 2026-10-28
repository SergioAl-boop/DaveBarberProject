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
            <span>Mar–Vie · 10:00–20:00</span>
            <span>Sábado · 9:00–18:00</span>
            <span>Dom–Lun · Cerrado</span>
          </div>

          <div>
            <h4>Contacto</h4>
            <span>WhatsApp · 55 0000 0000</span>
            <span>Ciudad de México, MX</span>
          </div>
        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} Dave Barber Studio. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}