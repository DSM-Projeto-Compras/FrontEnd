"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AuthService from "../../services/authService";
import RegisterTemplate from "../../components/templates/register/RegisterTemplate";
import { toast } from "react-toastify";

const RegisterPage: React.FC = () => {
  const [showSucessModal, setShowSucessModal] = useState(false);
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
    if (senha !== confirmarSenha) {
      toast.error("As senhas não coincidem. Por favor, verifique.");
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
        error.response.data.errors.forEach((err: { msg: string }) => {
          toast.error(err.msg);
        });
      } else {
        toast.error("Ocorreu um erro durante o cadastro. Por favor, tente novamente mais tarde.");
      }
      console.error("Erro no registro:", error);
    }
  };

  return (
    <RegisterTemplate
      onRegister={handleRegister}
      showSucessModal={showSucessModal}
      onSucessModalClose={handleModalClose}
    />
  );
};

export default RegisterPage;
