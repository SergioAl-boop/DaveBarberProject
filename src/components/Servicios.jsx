import "../styles/servicios.css";


export default function Servicios() {
  const servicios = [
    {
      id: 1,
      nombre: "FADE",
      precio: "$200",
      duracion: "45 min",
      imagen:
        "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600",
    },
    {
      id: 2,  
      nombre: "CORTE BÁSICO",
      precio: "$150",
      duracion: "35 min",
      imagen:
        "https://images.unsplash.com/photo-1517832606299-7ae9b720a186?w=600",
    },
    {
      id: 3,
      nombre: "CORTE Y BARBA",
      precio: "$280",
      duracion: "60 min",
      imagen:
        "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600",
    },
  ];

  return (
    <section className="services">
      <div className="services-header">
        <h2>
          Simple, claro, <span>sin sorpresas.</span>
        </h2>

        <p>
          Elige tu servicio. Todos incluyen asesoría de estilo y acabado
          profesional.
        </p>
      </div>

      <div className="services-grid">
        {servicios.map((servicio, index) => (
          <div className="service-card" key={servicio.id}>
            <img src={servicio.imagen} alt={servicio.nombre} />

            <div className="service-content">
              <span className="service-number">
                0{index + 1}
              </span>

              <p className="service-label">SERVICIO</p>

              <h3>{servicio.nombre}</h3>

              <div className="service-info">
                <span className="price">{servicio.precio}</span>
                <span>{servicio.duracion}</span>
              </div>

              <button>
                Elegir servicio
                <span>→</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="services-note">
        Tu cita queda protegida. Se requiere un anticipo de $100 por
        transferencia para confirmar.
      </div>
    </section>
  );
}