import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  nombre: string;
  email: string;
  rol: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Verificar si estamos en el cliente antes de acceder a localStorage
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error("Error parsing stored user", error);
          localStorage.removeItem("user");
        }
      }
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        setUser({ nombre: data.nombre, email: data.email, rol: data.rol });
      } else {
        if (response.status === 400) {
          throw new Error(
            data.error || "Datos inválidos. Verifica tu correo y contraseña."
          );
        } else if (response.status === 404) {
          throw new Error("El usuario no existe. Por favor, regístrate.");
        } else {
          throw new Error(data.error || "Error al iniciar sesión");
        }
      }
    } catch (error) {
      console.error(error);
      setError((error as Error).message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const register = async (nombre: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Usuario registrado correctamente");
      } else {
        throw new Error(data.error || "Error al registrar usuario");
      }
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
