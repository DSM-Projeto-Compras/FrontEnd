"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import AdminOrdersTemplate from "@/app/components/templates/admin-orders/AdminOrdersTemplate";

export default function AdminOrdersPage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push("/pages/login");
      } else if (!isAdmin) {
        router.push("/");
      } else {
        setIsCheckingAuth(false);
      }
    }
  }, [isAuthenticated, isAdmin, loading, router]);

  if (loading || isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Carregando...</p>
      </div>
    );
  }

  return <AdminOrdersTemplate />;
}
