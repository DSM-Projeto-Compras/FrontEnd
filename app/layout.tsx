import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ReactNode, useEffect } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import Head from "next/head";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    hj: any;
  }
}

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined" && window.hj) {
      window.hj("stateChange", pathname);
    }
  }, [pathname]);

  return (
    <html lang="en">
      <Head>
        {/* Código do Hotjar */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(h,o,t,j,a,r){
                  h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                  h._hjSettings={hjid:5234035,hjsv:6};
                  a=o.getElementsByTagName('head')[0];
                  r=o.createElement('script');r.async=1;
                  r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                  a.appendChild(r);
              })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
            `,
          }}
        />
      </Head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;