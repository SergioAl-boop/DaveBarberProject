import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

const ADMIN = {
  id: 1,
  nombre: "Dave",
  email: "dave@barberia.com",
  password: "Admin12345",
  rol: "admin",
};

const leerClientes = () => JSON.parse(localStorage.getItem("clientes") || "[]");

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "null")
  );

  const guardarSesion = (u) => {
    const { password, ...seguro } = u;
    localStorage.setItem("user", JSON.stringify(seguro));
    setUser(seguro);
    return seguro;
  };

  const login = async (email, password, modo) => {
    const todos = [ADMIN, ...leerClientes()];
    const encontrado = todos.find(
      (u) => u.email === email && u.password === password
    );

    if (!encontrado) throw new Error("Correo o contraseña incorrectos");
    if (modo === "admin" && encontrado.rol !== "admin")
      throw new Error("Esta cuenta no tiene acceso de administrador");

    return guardarSesion(encontrado);
  };

  const registrar = async ({ nombre, telefono, email, password }) => {
    const clientes = leerClientes();
    if (email === ADMIN.email || clientes.some((c) => c.email === email))
      throw new Error("Ese correo ya está registrado");

    const nuevo = { id: Date.now(), nombre, telefono, email, password, rol: "cliente" };
    localStorage.setItem("clientes", JSON.stringify([...clientes, nuevo]));
    return guardarSesion(nuevo);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, registrar, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);