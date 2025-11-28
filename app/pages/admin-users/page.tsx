"use client";

import AdminUsersTemplate from "../../../app/components/templates/admin-users/AdminUsersTemplate";
import { useAuth } from "../../../app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import AdminService from "../../../app/services/adminService";
import { toast } from "react-toastify";

const AdminUsersPage: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, loading, router]);

  const handleDelete = async (id: string) => {
    try {
      await AdminService.deleteUser(id);
      toast.success("Administrador removido com sucesso!");
      window.location.reload();
    } catch (error) {
      console.log("Erro ao excluir administrador:", error);
      toast.error("Não é permitido excluir administradores mais antigos.");
    }
  };

  if (loading) return null;

  return isAuthenticated ? (
    <AdminUsersTemplate onDelete={handleDelete} />
  ) : null;
};

export default AdminUsersPage;
