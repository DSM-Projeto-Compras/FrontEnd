"use client";

import React, { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import AdminService from "../../../app/services/adminService";
import ChangePasswordAdminTemplate from "../../../app/components/templates/change-password-admin/ChangePasswordAdminTemplate";
import { toast } from "react-toastify";

const AdminPasswordPage: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

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

      toast.success(data.message || "Senha alterada com sucesso!");
      router.push("/pages/admin-users")
      return true;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao alterar senha.");
      return false;
    }
  };

  return (
    <ChangePasswordAdminTemplate
      onSubmit={handleSubmit}
    />
  );
};

export default AdminPasswordPage;
