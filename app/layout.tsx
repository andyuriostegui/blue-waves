import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import WhatsAppButton from "@/components/WhatsAppButton";
import JsonLd from "@/components/JsonLd";
import { localBusinessJsonLd } from "@/lib/json-ld";
import {
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_OG_TITLE,
  SITE_TITLE,
  SITE_URL,
} from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: 'travel',
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_OG_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: '/bluebueno.png',
        width: 1200,
        height: 630,
        alt: 'Renta de yates de lujo en Cancún — Blue Waves',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_OG_TITLE,
    description: SITE_DESCRIPTION,
    images: ['/bluebueno.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-MX"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body 
        className="min-h-full flex flex-col bg-[#e0e5ec]" 
        suppressHydrationWarning
      >
        <JsonLd data={localBusinessJsonLd()} />
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