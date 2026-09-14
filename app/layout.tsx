import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import Script from "next/script";
import { Toaster } from "sonner";
import "./globals.css";
import WhatsAppButton from "@/components/WhatsAppButton";
import MetaPixel from "@/components/MetaPixel";
import JsonLd from "@/components/JsonLd";
import { localBusinessJsonLd } from "@/lib/json-ld";
import {
  getDictionary,
  htmlLang,
  ogLocale,
  parseLocale,
} from "@/lib/i18n";
import {
  META_PIXEL_ID,
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
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${META_PIXEL_ID}');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          {/* Meta's 1x1 tracking pixel; next/image is not appropriate here. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height={1}
            width={1}
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
        <MetaPixel />
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
