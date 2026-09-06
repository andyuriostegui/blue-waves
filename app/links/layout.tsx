import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  variable: "--font-serif",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Blue Waves Cancún | Links",
  description:
    "TikTok, Instagram, Facebook, WhatsApp y el sitio de Blue Waves. Renta de yates de lujo en Cancún.",
};

export default function LinksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${serif.variable} ${sans.variable} min-h-full`}>
      {children}
    </div>
  );
}
