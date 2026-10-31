import { createContext, useContext, useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined);
  const [perfil, setPerfil] = useState(null);
  const [cargando, setCargando] = useState(true);
  const registrando = useRef(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));

    const { data: sub } = supabase.auth.onAuthStateChange((_evento, s) => {
      if (registrando.current) return;
      setSession(s);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const userId = session?.user?.id;

  useEffect(() => {
    if (session === undefined) return;

    if (!userId) {
      setPerfil(null);
      setCargando(false);
      return;
    }

    let activo = true;
    setCargando(true);
    supabase
      .from("perfiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle()
      .then(({ data }) => {
        if (!activo) return;
        setPerfil(data);
        setCargando(false);
      });

    return () => { activo = false; };
  }, [session === undefined, userId]);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error("Correo o contraseña incorrectos");

    const { data: p } = await supabase
      .from("perfiles")
      .select("*")
      .eq("id", data.user.id)
      .maybeSingle();

    if (!p) {
      await supabase.auth.signOut();
      throw new Error("Tu perfil no está listo. Contacta al estudio.");
    }

    setPerfil(p);
    return p;
  };

  const registrar = async ({ nombre, telefono, email, password }) => {
    registrando.current = true;
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { nombre, telefono } },
      });
      if (error) throw new Error(error.message);
      await supabase.auth.signOut();
    } finally {
      registrando.current = false;
      setSession(null);
    }
  };

  const logout = () => supabase.auth.signOut();

  return (
    <AuthContext.Provider value={{ user: perfil, cargando, login, registrar, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);