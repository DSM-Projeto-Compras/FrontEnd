"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import HistoricTemplate from "../../components/templates/historic/HistoricTemplate";
import { useAuth } from "../../contexts/AuthContext";

const HistoricPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("login");
    }
  }, [isAuthenticated, router]);

  return isAuthenticated ? <HistoricTemplate /> : null;
};

export default HistoricPage;
