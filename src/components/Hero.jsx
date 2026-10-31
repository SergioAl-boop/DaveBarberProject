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
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTY5yFLjHNo2-oIt-1-618Gq13w7JfdTmbHFRtNGyUnpP84oDl7m2HtnHWH&s=10"
          alt="Barbero trabajando"
        />

      </div>
    </section>
  );
}