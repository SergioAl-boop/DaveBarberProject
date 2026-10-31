import { Link } from "react-router-dom";
import "../styles/Contactos.css";

const IconoUbicacion = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

const IconoTelefono = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
  </svg>
);

const IconoReloj = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

const IconoCalendario = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </svg>
);

const datos = [
  {
    icono: <IconoUbicacion />,
    label: "Estudio",
    valor: "Libertad 34, Agencia de Policia Esquipulas, 71232 Santa Cruz Xoxocotlán, Oax.",
    extra: "Ver ubicación",
    href: "https://maps.app.goo.gl/kTFktdRHfqGzPNDx8",
  },
  {
    icono: <IconoTelefono />,
    label: "WhatsApp",
    valor: "2871554566",
    extra: "Enviar mensaje",
    href: "https://wa.me/2871554566",
  },
  {
    icono: <IconoReloj />,
    label: "Horario",
    valor: "Mar–Sab 10:00 AM – 08:00 PM",
    extra: "Dom 12:00 PM – 06:00 PM",
  }
];

export default function Contacto() {
  return (
    <section className="contacto">
      <div className="container contacto-grid">
        <div className="contacto-texto">
          <h2>
            ¿Listo para tu
            <br />
            próximo corte?
          </h2>
          <p>
            Agenda en línea o escríbenos. Atendemos únicamente con cita para
            darte el tiempo que mereces.
          </p>
          <Link to="/reservas" className="btn-primary">
            Reservar cita <IconoCalendario />
          </Link>
        </div>

        <div className="contacto-card">
          {datos.map((d) => (
            <div key={d.label} className="contacto-item">
              <span className="contacto-icono">{d.icono}</span>
              <div>
                <small>{d.label}</small>
                <strong>{d.valor}</strong>
                {d.href ? (
                  <a href={d.href}>{d.extra}</a>
                ) : (
                  <em>{d.extra}</em>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}