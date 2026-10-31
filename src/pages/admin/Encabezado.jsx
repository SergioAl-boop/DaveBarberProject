export default function Encabezado({ titulo, texto }) {
  return (
    <header className="adm-head">
      <span>Panel administrador</span>
      <h1>{titulo}</h1>
      <p>{texto}</p>
    </header>
  );
}