"use client";

import React, { useEffect } from "react";
import AdminDashboardTemplate from "../../components/templates/admin-dashboard/AdminDashboardTemplate";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";

const AdminDashboardPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("login");
    }
  }, [isAuthenticated, router]);

  return isAuthenticated ? <AdminDashboardTemplate /> : null;
};

export default AdminDashboardPage;
