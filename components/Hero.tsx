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
    <section className="relative h-screen w-full overflow-hidden bg-[#0B2A30]">
      <Image 
        src="/bluebueno.png" 
        alt={dict.hero.imageAlt}
        fill 
        className="object-cover opacity-80 scale-110 md:scale-105"
        priority 
      />
      
      <div className="absolute inset-0 bg-[#0B2A30]/20 z-[1]" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0B2A30] to-transparent z-[2]" />      
      
      <nav className="absolute top-0 w-full flex justify-between items-center p-6 md:p-10 z-[50]">
        <span className="text-white tracking-[0.3em] md:tracking-[0.5em] uppercase text-[9px] md:text-[10px] font-bold">
          Blue Waves
        </span>
        
        <div className="flex items-center gap-4 md:gap-8">
          <div className="hidden md:flex gap-8 text-white/70 text-[10px] tracking-widest uppercase font-medium">
            {navLinks.map((link) => (
              <NavItem key={link.name} href={link.href}>{link.name}</NavItem>
            ))}
          </div>

          <LanguageSwitch className="hidden md:block" />

          <button 
            onClick={scrollToContact} 
            className="bg-white text-black px-5 py-2 md:px-6 md:py-2 rounded-full text-[8px] md:text-[9px] font-bold tracking-widest hover:bg-zinc-200 transition shadow-lg"
          >
            {dict.nav.book}
          </button>

          <button 
            onClick={() => setIsOpen(true)}
            className="md:hidden text-white p-2 border border-white/20 rounded-full bg-white/10 backdrop-blur-md"
          >
            <Anchor size={20} strokeWidth={1.5} className="rotate-12" />
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
              className="fixed top-0 right-0 h-full w-[75%] bg-[#0B2A30] z-[101] md:hidden p-10 flex flex-col shadow-2xl border-l border-white/10"
            >
              <button onClick={closeMenu} className="self-end text-white/50 mb-20">
                <X size={30} strokeWidth={1} />
              </button>

              <div className="flex flex-col gap-12">
                <span className="text-[8px] tracking-[0.5em] uppercase text-white/30 font-bold">{dict.nav.menu}</span>
                {navLinks.map((link) => (
                  <NavItem
                    key={link.name}
                    href={link.href}
                    onClick={closeMenu}
                    className="text-white font-serif italic text-4xl hover:text-blue-400 transition-colors"
                  >
                    {link.name}
                  </NavItem>
                ))}
                
                <div className="mt-10 pt-10 border-t border-white/10">
                   <button 
                    onClick={() => { closeMenu(); scrollToContact(); }}
                    className="w-full bg-white text-black py-4 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl"
                  >
                    {dict.nav.book}
                  </button>
                </div>
              </div>

              <LanguageSwitch className="mt-10" />

              <div className="mt-auto">
                 <Anchor size={40} strokeWidth={0.5} className="text-white/10 mx-auto" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="relative z-[10] flex flex-col items-center justify-center h-full text-center px-4">
        <motion.p 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="font-serif text-[18vw] md:text-[12vw] text-white leading-none italic font-light drop-shadow-2xl"
        >
          Blue Waves
        </motion.p>
        <h1 className="mt-6 text-white/70 tracking-[0.25em] md:tracking-[0.45em] uppercase text-[8px] md:text-[10px] font-medium">
          {dict.hero.h1}
        </h1>
        <motion.a
          href="#fleet"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="mt-10 inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.28em] text-[#0A192F] shadow-lg transition hover:bg-zinc-200"
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
