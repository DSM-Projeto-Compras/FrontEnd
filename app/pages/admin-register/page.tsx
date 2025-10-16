"use client";

import AdminRegisterTemplate from "@/app/components/templates/admin-register/AdminRegisterTemplate";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AuthService from "@/app/services/authService";
import AdminService from "@/app/services/adminService";

const AdminRegisterPage: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
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
      setErrorMessages(["Token inválido. Faça login novamente."]);
      return;
    }
    if (senha !== confirmarSenha) {
      setErrorMessages(["As senhas não coincidem. Por favor, verifique."]);
      return;
    }

    try {
      await AdminService.register({
        nome,
        email,
        senha,
        role: "admin",
      });
      alert("Administrador criado com sucesso!");
      router.push("/admin/dashboard");
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
    isAuthenticated && (
      <AdminRegisterTemplate
        onRegister={handleRegister}
        errorMessages={errorMessages}
      />
    )
  );
};

export default AdminRegisterPage;
