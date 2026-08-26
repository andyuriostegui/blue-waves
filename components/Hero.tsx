'use client'
import { useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Anchor, X } from "lucide-react";
import LanguageSwitch from "@/components/LanguageSwitch";
import { useI18n } from "@/components/LocaleProvider";
import { localizePath } from "@/lib/i18n/config";

export default function Hero({ scrollToContact }: { scrollToContact: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const { dict, locale } = useI18n();

  const navLinks = [
    { name: dict.nav.fleet, href: "#fleet" },
    { name: dict.nav.about, href: "#about" },
    { name: dict.nav.journey, href: "#journey" },
    { name: dict.nav.experiences, href: localizePath(locale, "/experiencias") },
  ];

  const closeMenu = () => setIsOpen(false);

  return (
    <section className="relative h-[100dvh] min-h-[560px] w-full overflow-hidden bg-[#0B2A30]">
      <Image 
        src="/bluebueno.png" 
        alt={dict.hero.imageAlt}
        fill 
        className="object-cover opacity-80 scale-110 md:scale-105"
        priority 
      />
      
      <div className="absolute inset-0 bg-[#0B2A30]/20 z-[1]" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0B2A30] to-transparent z-[2]" />      
      
      <nav className="absolute inset-x-0 top-0 z-[50] flex items-center justify-between gap-2 px-3 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-5 md:gap-8 md:p-10">
        <span className="min-w-0 truncate text-[9px] font-bold uppercase tracking-[0.18em] text-white md:tracking-[0.5em] md:text-[10px]">
          Blue Waves
        </span>
        
        <div className="flex shrink-0 items-center gap-2 sm:gap-3 md:gap-8">
          <div className="hidden md:flex gap-8 text-white/70 text-[10px] tracking-widest uppercase font-medium">
            {navLinks.map((link) => (
              <NavItem key={link.name} href={link.href}>{link.name}</NavItem>
            ))}
          </div>

          <LanguageSwitch />

          <button 
            onClick={scrollToContact} 
            className="hidden rounded-full bg-white px-6 py-2 text-[9px] font-bold tracking-widest text-black shadow-lg transition hover:bg-zinc-200 md:inline-flex"
          >
            {dict.nav.book}
          </button>

          <button 
            onClick={() => setIsOpen(true)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md sm:h-10 sm:w-10 md:hidden"
            aria-label={dict.nav.menu}
          >
            <Anchor size={16} strokeWidth={1.5} className="rotate-12" />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
              className="fixed inset-0 bg-[#0A192F]/80 backdrop-blur-md z-[100] md:hidden"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 z-[101] flex h-full w-[min(20rem,86%)] flex-col overflow-y-auto border-l border-white/10 bg-[#0B2A30] px-7 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))] shadow-2xl md:hidden"
            >
              <div className="mb-10 flex items-center justify-between">
                <LanguageSwitch />
                <button onClick={closeMenu} className="text-white/50" aria-label={dict.nav.close}>
                  <X size={26} strokeWidth={1} />
                </button>
              </div>

              <div className="flex flex-col gap-7">
                <span className="text-[8px] tracking-[0.5em] uppercase text-white/30 font-bold">{dict.nav.menu}</span>
                {navLinks.map((link) => (
                  <NavItem
                    key={link.name}
                    href={link.href}
                    onClick={closeMenu}
                    className="text-white font-serif italic text-3xl hover:text-blue-400 transition-colors"
                  >
                    {link.name}
                  </NavItem>
                ))}
                
                <div className="mt-6 border-t border-white/10 pt-8">
                   <button 
                    onClick={() => { closeMenu(); scrollToContact(); }}
                    className="w-full bg-white text-black py-4 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl"
                  >
                    {dict.nav.book}
                  </button>
                </div>
              </div>

              <div className="mt-auto pt-12">
                 <Anchor size={40} strokeWidth={0.5} className="text-white/10 mx-auto" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="relative z-[10] flex h-full flex-col items-center justify-center px-6 text-center">
        <motion.p 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="max-w-[16ch] font-serif text-[2.7rem] leading-[0.92] font-light italic text-white drop-shadow-2xl sm:text-6xl md:max-w-none md:text-[12vw]"
        >
          Blue Waves
        </motion.p>
        <h1 className="mt-5 max-w-[16rem] text-[8px] font-medium uppercase tracking-[0.16em] text-white/70 sm:max-w-none md:mt-6 md:text-[10px] md:tracking-[0.45em]">
          {dict.hero.h1}
        </h1>
        <motion.a
          href="#fleet"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="mt-8 inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-[9px] font-bold uppercase tracking-[0.22em] text-[#0A192F] shadow-lg transition hover:bg-zinc-200 md:mt-10 md:text-[10px] md:tracking-[0.28em]"
        >
          {dict.hero.seeFleet}
        </motion.a>
      </div>
    </section>
  );
}

function NavItem({
  href,
  className,
  onClick,
  children,
}: {
  href: string
  className?: string
  onClick?: () => void
  children: ReactNode
}) {
  const classes = className ?? 'hover:text-white transition'

  if (href.startsWith('/')) {
    return (
      <Link href={href} onClick={onClick} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <a href={href} onClick={onClick} className={classes}>
      {children}
    </a>
  )
}
