"use client";

import AdminUsersTemplate from "@/app/components/templates/admin-users/AdminUsersTemplate";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import AdminService from "@/app/services/adminService";

const AdminUsersPage: React.FC = () => {
    const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("login");
    }
  }, [isAuthenticated, loading, router]);

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este administrador?")) return;

    try {
      await AdminService.deleteUser(id);
      alert("Administrador removido com sucesso!");
      window.location.reload();
    } catch (error) {
      console.log("Erro ao excluir administrador:", error);
      alert("Não é permitido excluir administradores mais antigos.");
    }
  };

  if (loading) return null;

  return isAuthenticated ? (
    <AdminUsersTemplate onDelete={handleDelete} />
  ) : null;
}

export default AdminUsersPage;