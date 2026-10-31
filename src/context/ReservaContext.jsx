import { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";
import LoginModal from "../components/LoginModal";
import Reservas from "../components/Reservas";

const ReservaContext = createContext(null);

export function ReservaProvider({ children }) {
  const { user } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);
  const [reservaOpen, setReservaOpen] = useState(false);
  const [pendiente, setPendiente] = useState(false);

  const abrirLogin = () => {
    setPendiente(false);
    setLoginOpen(true);
  };

  const abrirReserva = () => {
    if (user?.rol === "admin") return;
    if (!user) {
      setPendiente(true);
      setLoginOpen(true);
      return;
    }
    setReservaOpen(true);
  };

  const alIniciarSesion = () => {
    if (pendiente) setReservaOpen(true);
    setPendiente(false);
  };

  return (
    <ReservaContext.Provider value={{ abrirLogin, abrirReserva }}>
      {children}
      {loginOpen && (
        <LoginModal onClose={() => setLoginOpen(false)} onLogin={alIniciarSesion} />
      )}
      {reservaOpen && <Reservas onClose={() => setReservaOpen(false)} />}
    </ReservaContext.Provider>
  );
}

export const useReserva = () => useContext(ReservaContext);