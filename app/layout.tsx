import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import WhatsAppButton from "@/components/WhatsAppButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ESTO ES LO QUE GOOGLE LEE
export const metadata: Metadata = {
  title: 'Blue Waves Cancún | Renta de Yates de Lujo',
  description: 'Descubre el Caribe a bordo de nuestra flota exclusiva. Salida desde la bahía de Cancún con impresionantes cambios de color del agua hasta llegar al azul turquesa.',
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
      suppressHydrationWarning
    >
      <body 
        className="min-h-full flex flex-col bg-[#e0e5ec]" 
        suppressHydrationWarning
      >
        {children}
        
        {/* El botón ahora se controla solo */}
        <WhatsAppButton />
        
        <Toaster 
          position="top-right" 
          toastOptions={{
            style: {
              borderRadius: '20px',
              background: '#f0f2f5',
            },
          }}
        />
      </body>
    </html>
  );
}