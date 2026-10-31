import Encabezado from "./Encabezado";

export default function Proximamente({ titulo }) {
  return (
    <>
      <Encabezado titulo={titulo} texto="Esta sección estará disponible pronto." />
      <div className="adm-card vacio">Próximamente</div>
    </>
  );
}