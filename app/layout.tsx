'use client'
import { usePathname } from 'next/navigation';
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  // CONDICIÓN: Si la ruta empieza con /dashboard, ocultamos el botón
  const isDashboardPage = pathname?.startsWith('/dashboard');

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
        
        {/* Solo mostramos el botón si NO estamos en el dashboard */}
        {!isDashboardPage && <WhatsAppButton />}
        
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