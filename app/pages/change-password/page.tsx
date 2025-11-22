"use client";
import React from "react";
import ChangePasswordUserTemplate from "../../../app/components/templates/change-password-user/ChangePasswordUserTemplate";
import AuthService from "../../../app/services/authService";

const ChangePasswordPage: React.FC = () => {
  const [step, setStep] = React.useState(1);
  const [email, setEmail] = React.useState("");
  const [codigo, setCodigo] = React.useState("");
  const [novaSenha, setNovaSenha] = React.useState("");
  const [mensagem, setMensagem] = React.useState("");
  const [erro, setErro] = React.useState("");

  const clearMessages = () => {
    setErro("");
    setMensagem("");
  };

  const handleSendEmail = async () => {
    clearMessages();
    try {
      const res = await AuthService.forgotPassword(email);
      setMensagem(res.message);
      setStep(2);
    } catch (error: any) {
      setErro(error.response?.data?.message || "Erro ao enviar email");
    }
  };

  const handleResetPassword = async () => {
    clearMessages();
    try {
      const res = await AuthService.resetPassword(email, codigo, novaSenha);
      setMensagem(res.message);
      setStep(3);
    } catch (error: any) {
      setErro(error.response?.data?.message || "Erro ao redefinir senha");
    }
  };

  return (
    <ChangePasswordUserTemplate
      step={step}
      setStep={setStep}
      email={email}
      setEmail={setEmail}
      codigo={codigo}
      setCodigo={setCodigo}
      novaSenha={novaSenha}
      setNovaSenha={setNovaSenha}
      mensagem={mensagem}
      erro={erro}
      handleSendEmail={handleSendEmail}
      handleResetPassword={handleResetPassword}
    />
  );
};

export default ChangePasswordPage;
