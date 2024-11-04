"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthService from "../../services/authService";
import LoginTemplate from "../../components/templates/login/LoginTemplate";

const LoginPage: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const savedCredentials = localStorage.getItem("savedCredentials");
    if (savedCredentials) {
      const { email, senha } = JSON.parse(savedCredentials);
    }
  }, []);

  const handleLogin = async (
    email: string,
    password: string,
    remember: boolean
  ) => {
    try {
      const response = await AuthService.login({ email, senha: password });
      localStorage.setItem("access_token", response.access_token);

      if (remember) {
        localStorage.setItem(
          "savedCredentials",
          JSON.stringify({ email, senha: password })
        );
      } else {
        localStorage.removeItem("savedCredentials");
      }

      if (response.cargo === "admin") {
        router.push("admin-dashboard");
      } else {
        router.push("requisition");
      }
    } catch (error) {
      setErrorMessage("Erro ao fazer login. Verifique suas credenciais.");
      console.error("Erro no login:", error);
    }
  };

  return <LoginTemplate onLogin={handleLogin} errorMessage={errorMessage} />;
};

export default LoginPage;
