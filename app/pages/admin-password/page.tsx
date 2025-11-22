"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import AdminService from "@/app/services/adminService";
import ChangePasswordAdminTemplate from "@/app/components/templates/change-password-admin/ChangePasswordAdminTemplate";

const AdminPasswordPage: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/");
    }
  }, [loading, isAuthenticated, router]);

  if (loading) return null;

  const handleSubmit = async (
    currentPassword: string,
    newPassword: string,
    confirmNewPassword: string
  ) => {
    try {
      const data = await AdminService.changePassword(
        currentPassword,
        newPassword,
        confirmNewPassword
      );

      setMensagem(data.message || "Senha alterada com sucesso!");
      router.push("admin-users")
      return true;
    } catch (error: any) {
      setMensagem(error.response?.data?.message || "Erro ao alterar senha.");
      return false;
    }
  };

  return (
    <ChangePasswordAdminTemplate
      onSubmit={handleSubmit}
      mensagem={mensagem}
    />
  );
};

export default AdminPasswordPage;
