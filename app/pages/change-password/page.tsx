"use client";
import React from "react";
import ChangePasswordUserTemplate from "../../../app/components/templates/change-password-user/ChangePasswordUserTemplate";
import AuthService from "../../../app/services/authService";
import { toast } from "react-toastify";

const ChangePasswordPage: React.FC = () => {
  const [step, setStep] = React.useState(1);
  const [email, setEmail] = React.useState("");
  const [codigo, setCodigo] = React.useState("");
  const [novaSenha, setNovaSenha] = React.useState("");

  const handleSendEmail = async () => {
    try {
      const res = await AuthService.forgotPassword(email);
      toast.success(res.message);
      setStep(2);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao enviar email");
    }
  };

  const handleResetPassword = async () => {
    try {
      const res = await AuthService.resetPassword(email, codigo, novaSenha);
      toast.success(res.message);
      setStep(3);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao redefinir senha");
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
      handleSendEmail={handleSendEmail}
      handleResetPassword={handleResetPassword}
    />
  );
};

export default ChangePasswordPage;
