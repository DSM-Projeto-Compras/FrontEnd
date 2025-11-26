"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSuppliersTemplate from "../../components/templates/admin-suppliers/AdminSuppliersTemplate";
import { useAuth } from "../../contexts/AuthContext";

const AdminSuppliersPage: React.FC = () => {
  const { isAuthenticated, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push("/pages/login");
      } else if (!isAdmin) {
        router.push("/pages/requisition");
      }
    }
  }, [isAuthenticated, isAdmin, loading, router]);

  if (loading) return null;

  return isAuthenticated && isAdmin ? <AdminSuppliersTemplate /> : null;
};

export default AdminSuppliersPage;
