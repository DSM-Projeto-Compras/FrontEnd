"use client";

import React, { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import ChangePasswordAdminTemplate from "@/app/components/templates/change-password-admin/ChangePasswordAdminTemplate";

const AdminPasswordPage: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) return null;

  return isAuthenticated ? <ChangePasswordAdminTemplate /> : null;
};

export default AdminPasswordPage;
