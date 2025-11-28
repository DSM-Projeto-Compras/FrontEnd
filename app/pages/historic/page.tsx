"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import HistoricTemplate from "../../components/templates/historic/HistoricTemplate";
import { useAuth } from "../../contexts/AuthContext";

const HistoricPage: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/pages/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) return null;

  return isAuthenticated ? <HistoricTemplate /> : null;
};

export default HistoricPage;
