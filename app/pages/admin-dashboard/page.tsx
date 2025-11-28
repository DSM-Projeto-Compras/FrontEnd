"use client";

import React, { useEffect } from "react";
import AdminDashboardTemplate from "../../components/templates/admin-dashboard/AdminDashboardTemplate";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";

const AdminDashboardPage: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/pages/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) return null;

  return isAuthenticated ? <AdminDashboardTemplate /> : null;
};

export default AdminDashboardPage;
