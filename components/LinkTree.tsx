'use client'

import Image from "next/image";
import { motion } from "framer-motion";

const INSTAGRAM = "https://www.instagram.com/bluewavescancun/";
const WHATSAPP_URL = `https://wa.me/5219982322661?text=${encodeURIComponent(
  "Hola Blue Waves, me gustaría solicitar información sobre la flota de yates."
)}`;

const links = [
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@bluewavescancun",
    icon: TikTokIcon,
  },
  {
    name: "Instagram",
    href: INSTAGRAM,
    icon: InstagramIcon,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/bluewavescancun/",
    icon: FacebookIcon,
  },
  {
    name: "WhatsApp",
    href: WHATSAPP_URL,
    icon: WhatsAppIcon,
  },
  {
    name: "Sitio Web",
    href: "/",
    icon: GlobeIcon,
    primary: true,
  },
];

const reels = [
  {
    src: "/links/reel-yacht.mp4",
    poster: "/links/preview-yacht.jpg",
    label: "VIVE",
  },
  {
    src: "/links/reel-waves.mp4",
    poster: "/links/preview-waves.jpg",
    label: "Caribe",
  },
  {
    src: "/links/reel-deck.mp4",
    poster: "/links/preview-deck.jpg",
    label: "On Deck",
  },
];

export default function LinkTree() {
  return (
    <div className="relative min-h-screen font-sans text-white selection:bg-white selection:text-[#0A192F] overflow-x-hidden">
      <div className="absolute inset-0 z-0 overflow-hidden bg-[#0B2A30]">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover opacity-25"
        >
          <source src="/links/bg-waves.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B2A30]/85 via-[#0B2A30]/80 to-[#0A192F]" />
      </div>

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-md flex-col items-center px-6 pb-16 pt-10">
        <motion.div
          initial={{ y: 10 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.45 }}
          className="flex flex-col items-center text-center"
        >
          <div className="relative mb-5 h-24 w-24 overflow-hidden rounded-full border border-[#E8B923]/70 bg-[#0B2A30] shadow-[0_0_40px_rgba(232,185,35,0.22)]">
            <Image
              src="/links/logo.png"
              alt="Blue Waves Cancún"
              fill
              priority
              className="object-cover"
              sizes="96px"
            />
          </div>

          <span className="mb-2 text-[8px] font-bold uppercase tracking-[0.5em] text-white/70 md:text-[9px] md:tracking-[0.8em]">
            Est. 2026
          </span>

          <h1
            className="font-serif text-5xl font-light italic leading-none text-white md:text-6xl"
            style={{ textShadow: "0 4px 18px rgba(0,0,0,0.55)" }}
          >
            Blue Waves
          </h1>

          <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.45em] text-white/75">
            Cancún
          </p>
        </motion.div>

        <nav className="mt-8 flex w-full flex-col gap-2.5">
          {links.map((link, i) => {
            const Icon = link.icon;
            return (
              <motion.a
                key={link.name}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                initial={{ y: 8 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.05 + i * 0.04, duration: 0.35 }}
                className={
                  link.primary
                    ? "flex items-center justify-center gap-3 rounded-full bg-white px-6 py-3 text-[10px] font-bold uppercase tracking-[0.28em] text-black shadow-lg transition hover:bg-zinc-200"
                    : "flex items-center justify-center gap-3 rounded-full border border-white/30 bg-white/15 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.28em] text-white backdrop-blur-xl transition hover:bg-white hover:text-black"
                }
              >
                <Icon size={16} strokeWidth={1.6} />
                {link.name}
              </motion.a>
            );
          })}
        </nav>

        <motion.section
          initial={{ y: 8 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="mt-10 w-full"
        >
          <div className="mb-4">
            <span className="text-[8px] font-bold uppercase tracking-[0.35em] text-white/55">
              La experiencia
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {reels.map((reel) => (
              <a
                key={reel.src}
                href={INSTAGRAM}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-[9/16] overflow-hidden rounded-lg border border-white/10 bg-black/30"
              >
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  poster={reel.poster}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                >
                  <source src={reel.src} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                <span className="absolute bottom-2 left-2 text-[7px] font-bold uppercase tracking-[0.25em] text-white/80">
                  {reel.label}
                </span>
              </a>
            ))}
          </div>
        </motion.section>

        <p className="mt-auto pt-12 text-center text-[8px] uppercase tracking-[0.5em] text-white/40">
          © 2026 Blue Waves · Cancún
        </p>
      </main>
    </div>
  );
}

function InstagramIcon({ size = 16, strokeWidth = 1.6 }: { size?: number; strokeWidth?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth ?? 1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon({ size = 16 }: { size?: number; strokeWidth?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h3l1-3h-4v-2c0-.6.4-1 1-1Z" />
    </svg>
  );
}

function GlobeIcon({ size = 16, strokeWidth = 1.6 }: { size?: number; strokeWidth?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" />
    </svg>
  );
}

function TikTokIcon({ size = 16 }: { size?: number; strokeWidth?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.16 15.3 6.34 6.34 0 0 0 16.1 11.4V8.73a8.18 8.18 0 0 0 4.76 1.52V6.84a4.84 4.84 0 0 1-1.27-.15Z" />
    </svg>
  );
}

function WhatsAppIcon({ size = 16 }: { size?: number; strokeWidth?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 448 512"
      fill="currentColor"
      aria-hidden
    >
      <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
    </svg>
  );
}
