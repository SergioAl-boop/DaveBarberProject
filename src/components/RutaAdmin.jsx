import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RutaAdmin({ children }) {
  const { user, cargando } = useAuth();
  if (cargando) return <p style={{ padding: "2rem" }}>Cargando...</p>;
  if (user?.rol !== "admin") return <Navigate to="/" replace />;
  return children;
}