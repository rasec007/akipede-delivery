import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Akipede - Delivery | Gestão ERP Premium",
  description: "Sistema completo de gestão para delivery multi-tenant com notificações WhatsApp e tempo real.",
  keywords: ["delivery", "erp", "gestão", "restaurante", "akipede", "whatsapp notification"],
  authors: [{ name: "Akipede Team" }],
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Akipede - Delivery",
    description: "A melhor plataforma de delivery para seu estabelecimento.",
    url: "https://akipede.com.br",
    siteName: "Akipede - Delivery",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 800,
        alt: "Akipede - Delivery Logo",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Akipede - Delivery",
    description: "A melhor plataforma de delivery para seu estabelecimento.",
    images: ["/logo.png"],
  },
};

import { Toaster } from 'react-hot-toast';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className={`${inter.className} bg-[#020617]`}>
        {children}
        <Toaster 
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#111827',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
