"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import AdminService from "@/app/services/adminService";
import ChangePasswordAdminTemplate from "@/app/components/templates/change-password-admin/ChangePasswordAdminTemplate";

const AdminPasswordPage: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmaNovaSenha, setConfirmaNovaSenha] = useState("");
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/");
    }
  }, [loading, isAuthenticated, router]);

  if (loading) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (novaSenha !== confirmaNovaSenha) {
      setMensagem("As senhas não coincidem.");
      return;
    }

    try {
      const data = await AdminService.changePassword(
        senhaAtual,
        novaSenha,
        confirmaNovaSenha
      );
      setMensagem(data.message || "Senha alterada com sucesso!");
    } catch (error: any) {
      setMensagem(error.response?.data?.message || "Erro ao alterar senha.");
    }
  };

  return (
    <ChangePasswordAdminTemplate
      senhaAtual={senhaAtual}
      novaSenha={novaSenha}
      confirmaNovaSenha={confirmaNovaSenha}
      onSenhaAtualChange={(e) => setSenhaAtual(e.target.value)}
      onNovaSenhaChange={(e) => setNovaSenha(e.target.value)}
      onConfirmaNovaSenhaChange={(e) => setConfirmaNovaSenha(e.target.value)}
      onSubmit={handleSubmit}
      mensagem={mensagem}
    />
  );
};

export default AdminPasswordPage;
