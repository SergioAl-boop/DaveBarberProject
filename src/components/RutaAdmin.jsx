import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RutaAdmin({ children }) {
  const { user } = useAuth();
  if (!user || user.rol !== "admin") return <Navigate to="/" replace />;
  return children;
}