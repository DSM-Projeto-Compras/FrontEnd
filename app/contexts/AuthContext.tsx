"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import AuthService from "../services/authService";

interface AuthContextProps {
  isAuthenticated: boolean;
  loading?: boolean;
  user: any;
  login: (email: string, password: string, remember: boolean) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      (async () => {
        try {
          const userData = await AuthService.getMe();
          setUser(userData);
          setIsAuthenticated(true);
        } catch (err) {
          console.error("Erro ao buscar usuário logado:", err);
          localStorage.removeItem("access_token");
          setIsAuthenticated(false);
        } finally {
          setLoading(false);
        }
      })();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string, remember: boolean) => {
    try {
      const response = await AuthService.login({ email, senha: password });
      localStorage.setItem("access_token", response.access_token);

      if (remember) {
        localStorage.setItem(
          "savedCredentials",
          JSON.stringify({ email, senha: password })
        );
      }

      setIsAuthenticated(true);

      try {
        const fullUser = await AuthService.getMe();
        setUser(fullUser);
      } catch(err) {
        console.error("Erro ao obter dados do usuário (getme): ", err)
        setUser({ nome: response.nome, email, cargo: response.cargo });
      }

      if (response.cargo === "admin") {
        router.push("admin-dashboard");
      } else {
        router.push("requisition");
      }
    } catch (error) {
      console.error("Erro ao fazer login", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("savedCredentials");
    setIsAuthenticated(false);
    setUser(null);
    router.push("/")
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
