import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner"; // Importamos el componente de notificaciones
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BlueWaves | Admin Dashboard",
  description: "Sistema de gestión de flota y leads de lujo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      // Esto evita el error de la pantalla negra por extensiones de navegador
      suppressHydrationWarning
    >
      <body 
        className="min-h-full flex flex-col bg-[#e0e5ec]" // Color base neumórfico
        suppressHydrationWarning
      >
        {children}
        
        {/* El Toaster es el "padre" de todos los popups estéticos */}
        <Toaster 
          position="top-right" 
          expand={false} 
          richColors 
          closeButton
          toastOptions={{
            style: {
              borderRadius: '20px', // Estética redondeada como tu diseño
              background: '#f0f2f5',
              border: '1px solid #ffffff',
              boxShadow: '5px 5px 10px #bebebe, -5px -5px 10px #ffffff' // Efecto neumórfico sutil
            },
          }}
        />
      </body>
    </html>
  );
}