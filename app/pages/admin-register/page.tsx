"use client";

import AdminRegisterTemplate from "../../../app/components/templates/admin-register/AdminRegisterTemplate";
import { useAuth } from "../../../app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminService from "../../../app/services/adminService";
import { toast } from "react-toastify";

const AdminRegisterPage: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [showSucessModal, setShowSucessModal] = useState(false);

  const handleModalClose = () => {
    setShowSucessModal(false);
    router.push("/pages/admin-users");
  }

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) return null;

  const handleRegister = async (
    nome: string,
    email: string,
    senha: string,
    confirmarSenha: string
  ) => {
    const token = localStorage.getItem("access_token");
     if (!token) {
      toast.error("Token inválido. Faça login novamente.");
      return;
    }
    if (senha !== confirmarSenha) {
      toast.error("As senhas não coincidem. Por favor, verifique.");
      return;
    }

    try {
      await AdminService.register({
        nome,
        email,
        senha,
        role: "admin",
      });
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
    isAuthenticated && (
      <AdminRegisterTemplate
        onRegister={handleRegister}
        showSucessModal={showSucessModal}
        onSucessModalClose={handleModalClose}
      />
    )
  );
};

export default AdminRegisterPage;
