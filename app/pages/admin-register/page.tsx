"use client"

import AdminRegisterTemplate from "@/app/components/templates/admin-register/AdminRegisterTemplate";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const AdminRegisterPage: React.FC = () => {
    const { isAuthenticated, loading } = useAuth();
      const router = useRouter();
    
      useEffect(() => {
        if (!loading && !isAuthenticated) {
          router.push("login");
        }
      }, [isAuthenticated, loading, router]);
    
      if (loading) return null;
    
      return isAuthenticated ? <AdminRegisterTemplate /> : null;

}

export default AdminRegisterPage;