"use client";

import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import LoginTemplate from "../../components/templates/login/LoginTemplate";

const LoginPage: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const { login } = useAuth();

  const handleLogin = async (
    email: string,
    password: string,
    remember: boolean
  ) => {
    try {
      await login(email, password, remember);
    } catch (error) {
      setErrorMessage("Erro ao fazer login. Verifique suas credenciais.");
    }
  };

  return <LoginTemplate onLogin={handleLogin} errorMessage={errorMessage} />;
};

export default LoginPage;
