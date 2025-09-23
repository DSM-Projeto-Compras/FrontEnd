"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import RequisitionTemplate from "../../components/templates/requisition/RequisitionTemplate";
import { useAuth } from "../../contexts/AuthContext";

const RequisitionPage: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) return null;

  return isAuthenticated ? <RequisitionTemplate /> : null;
};

export default RequisitionPage;
