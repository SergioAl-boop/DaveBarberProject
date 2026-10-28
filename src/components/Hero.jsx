import { Link } from "react-router-dom";
import "../styles/Hero.css";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-text">
        <span className="eyebrow">Barbería de autor · Una silla, atención total</span>

        <h1>
          <span className="white">Tu estilo.</span>
          <span className="red">Bien hecho.</span>
        </h1>

        <p>
          Cortes precisos, servicio personal y el tiempo que mereces.
          <br />
          Reserva directo con Dave.
        </p>

        <div className="hero-buttons">
          <Link to="/reservas" className="btn-primary">Aparta con $100 →</Link>
          <Link to="/servicios" className="btn-secondary">Ver servicios</Link>
        </div>

        <div className="stats">
          <div>
            <strong>+250</strong>
            <span>Clientes atendidos</span>
          </div>
          <div>
            <strong>4.9</strong>
            <span>Calificación promedio</span>
          </div>
        </div>
      </div>

      <div className="hero-image">
        <img
          src="https://tvazteca-adnnoticias-prod.web.arc-cdn.net/resizer/v2/JOOORTRMV5BDFOIJF5MDOBGVYE.jpg?auth=8883bcd208c844645e9c47017138ae1a176b4d7fdda4d70517b0457aefae25e6&width=800&height=963"
          alt="Barbero trabajando"
        />

        <Link to="/reservas" className="next-slot">
          <span className="dot" />
          <div>
            <small>PRÓXIMO ESPACIO</small>
            <strong>Hoy · 4:30 PM</strong>
          </div>
          <span className="arrow">›</span>
        </Link>
      </div>
    </section>
  );
}