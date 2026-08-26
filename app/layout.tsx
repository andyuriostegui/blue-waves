import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import { Toaster } from "sonner";
import "./globals.css";
import WhatsAppButton from "@/components/WhatsAppButton";
import JsonLd from "@/components/JsonLd";
import { localBusinessJsonLd } from "@/lib/json-ld";
import {
  getDictionary,
  htmlLang,
  ogLocale,
  parseLocale,
} from "@/lib/i18n";
import {
  SITE_NAME,
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

export async function generateMetadata(): Promise<Metadata> {
  const locale = parseLocale((await headers()).get("x-locale") ?? "es");
  const dict = getDictionary(locale);

  return {
    metadataBase: new URL(SITE_URL),
    applicationName: SITE_NAME,
    title: {
      default: dict.seo.title,
      template: `%s | ${SITE_NAME}`,
    },
    description: dict.seo.description,
    keywords: [...dict.seo.keywords],
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    category: "travel",
    openGraph: {
      type: "website",
      locale: ogLocale(locale),
      siteName: SITE_NAME,
      title: dict.seo.ogTitle,
      description: dict.seo.description,
      images: [
        {
          url: "/bluebueno.png",
          width: 1200,
          height: 630,
          alt: dict.seo.ogImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.seo.ogTitle,
      description: dict.seo.description,
      images: ["/bluebueno.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = parseLocale((await headers()).get("x-locale") ?? "es");

  return (
    <html
      lang={htmlLang(locale)}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body 
        className="min-h-full flex flex-col bg-[#e0e5ec]" 
        suppressHydrationWarning
      >
        <JsonLd data={localBusinessJsonLd(locale)} />
        {children}
        
        <WhatsAppButton />
        
        <Toaster 
          position="top-right" 
          toastOptions={{
            style: {
              borderRadius: "20px",
              background: "#f0f2f5",
            },
          }}
        />
      </body>
    </html>
  );
}
