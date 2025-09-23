"use client";

import AdminUsersTemplate from "@/app/components/templates/admin-users/AdminUsersTemplate";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const AdminUsersPage: React.FC = () => {
    const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) return null;

  return isAuthenticated ? <AdminUsersTemplate /> : null;
}

export default AdminUsersPage;