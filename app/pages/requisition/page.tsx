"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import RequisitionTemplate from "../../components/templates/requisition/RequisitionTemplate";
import { useAuth } from "../../contexts/AuthContext";

const RequisitionPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("login");
    }
  }, [isAuthenticated, router]);

  return isAuthenticated ? <RequisitionTemplate /> : null;
};

export default RequisitionPage;
