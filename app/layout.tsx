"use client";

import { useEffect, ReactNode } from "react";
import Hotjar from "@hotjar/browser";
import "./globals.css";
import { AuthProvider } from "./contexts/AuthContext";
import { VoiceProvider } from "./contexts/VoiceContext";
import { usePathname } from "next/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  const pathname = usePathname();

  useEffect(() => {
    Hotjar.init(5234035, 6);

    if (typeof window !== "undefined" && (window as any).hj) {
      (window as any).hj("stateChange", pathname);
    }
  }, [pathname]);

  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <VoiceProvider>
            {children}

            {/* Toasts funcionando em qualquer lugar da aplicação */}
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </VoiceProvider>
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
