"use client"; // Garantir que este código seja executado no lado do cliente

import type { Metadata } from "next";
import { useEffect } from "react";
import Hotjar from "@hotjar/browser"; // Importar o Hotjar
import "./globals.css";
import localFont from "next/font/local";
import { ReactNode } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { usePathname } from "next/navigation";

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  const pathname = usePathname();

  useEffect(() => {
    // Inicializar o Hotjar com seu Site ID e versão
    Hotjar.init(5234035, 6); // Inicializa o Hotjar com o seu ID do site e a versão

    // Cast de window para qualquer tipo para permitir o uso da propriedade hj
    if (typeof window !== "undefined" && (window as any).hj) {
      (window as any).hj("stateChange", pathname); // Usando casting para acessar hj
    }
  }, [pathname]);

  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
