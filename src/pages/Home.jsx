import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Servicios from "../components/Servicios";
import Portafolio from "../components/Portafolio";
import Productos from "../components/Productos";
import Contacto from "../components/Contacto";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />

      <Hero />

      <div id="servicios">
        <Servicios />
      </div>

      <div id="portafolio">
        <Portafolio />
      </div>

      <div id="productos">
        <Productos />
      </div>

      <div id="contacto">
        <Contacto />
      </div>

      <Footer />
    </>
  );
}