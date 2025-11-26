"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AuthService from "../../services/authService";
import RegisterTemplate from "../../components/templates/register/RegisterTemplate";

const RegisterPage: React.FC = () => {
  const [showSucessModal, setShowSucessModal] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const router = useRouter();

  const handleModalClose = () => {
    setShowSucessModal(false);
    router.push("/");
  }

  const handleRegister = async (
    nome: string,
    email: string,
    senha: string,
    confirmarSenha: string
  ) => {
    setErrorMessages([]);

    if (senha !== confirmarSenha) {
      setErrorMessages(["As senhas não coincidem. Por favor, verifique."]);
      return;
    }

    try {
      await AuthService.register({ nome, email, senha });

      setShowSucessModal(true);
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        Array.isArray(error.response.data.errors)
      ) {
        setErrorMessages(
          error.response.data.errors.map((err: { msg: string }) => err.msg)
        );
      } else {
        setErrorMessages([
          "Ocorreu um erro durante o cadastro. Por favor, tente novamente mais tarde.",
        ]);
      }
      console.error("Erro no registro:", error);
    }
  };

  return (
      <RegisterTemplate
        onRegister={handleRegister}
        errorMessages={errorMessages}
        showSucessModal={showSucessModal}
        onSucessModalClose={handleModalClose}
      />
  );
};

export default RegisterPage;
