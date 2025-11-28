"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import AuthService from "../services/authService";

interface AuthContextProps {
  isAuthenticated: boolean;
  loading?: boolean;
  isAdmin: boolean;
  user: any;
  login: (email: string, password: string, remember: boolean) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
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
          setIsAdmin(userData.cargo === "admin");
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
        const fullUser = await AuthService.getMe(response.access_token);
        setUser(fullUser);
        setIsAdmin(fullUser.cargo === "admin");
      } catch (err) {
        console.warn("getMe falhou com token direto, fallback:", err);
        setUser({ email, cargo: response.cargo });
        setIsAdmin(response.cargo === "admin");
      }

      if (response.cargo === "admin") {
        router.push("/pages/admin-dashboard");
      } else {
        router.push("/pages/requisition");
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
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, loading, isAdmin, user, login, logout }}
    >
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
