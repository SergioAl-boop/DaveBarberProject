import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RutaCliente({ children }) {
  const { user, cargando } = useAuth();
  if (cargando) return <p style={{ padding: "2rem" }}>Cargando...</p>;
  if (!user) return <Navigate to="/" replace />;
  if (user.rol === "admin") return <Navigate to="/admin" replace />;
  return children;
}