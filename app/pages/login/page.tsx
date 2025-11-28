"use client";

import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import LoginTemplate from "../../components/templates/login/LoginTemplate";
import { toast } from "react-toastify";

const LoginPage: React.FC = () => {
  const { login } = useAuth();

  const handleLogin = async (
    email: string,
    password: string,
    remember: boolean
  ) => {
    try {
      await login(email, password, remember);
    } catch (error) {
      toast.error("Erro ao fazer login. Verifique suas credenciais.");
    }
  };

  return <LoginTemplate onLogin={handleLogin} />;
};

export default LoginPage;
