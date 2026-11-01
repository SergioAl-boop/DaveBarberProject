import "../styles/servicios.css";


export default function Servicios() {
  const servicios = [
    {
      id: 1,
      nombre: "AFEITADO & DELINEADO DE BARBA",
      precio: "$150",
      duracion: "45 min",
      imagen:
        "/assets/images/afeitado.png",
    },
    {
      id: 2,  
      nombre: "DESVANECIDO (A PIEL)",
      precio: "$200",
      duracion: "35 min",
      imagen:
       "/assets/images/Desvanecidopiel.png",
    },
    {
      id: 3,
      nombre: "TAPER FADE",
      precio: "$280",
      duracion: "60 min",
      imagen:
        "/assets/images/taperfade.png",
    },
    {
      id: 3,
      nombre: "CORTE ESCOLAR",
      precio: "$130",
      duracion: "60 min",
      imagen:
        "/assets/images/escolar.png",
    },
    {
      id: 3,
      nombre: "RECORTE CLASICO",
      precio: "$150",
      duracion: "60 min",
      imagen:
        "/assets/images/clasico.png",
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

    
    </section>
  );
}