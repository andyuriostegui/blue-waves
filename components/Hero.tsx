'use client'
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Anchor, X } from "lucide-react"; // Importamos el ancla y la X

export default function Hero({ scrollToContact }: { scrollToContact: () => void }) {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Fleet", href: "#fleet" },
    { name: "About Us", href: "#about" },
    { name: "Journey", href: "#journey" },
  ];

  const closeMenu = () => setIsOpen(false);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#0B2A30]">
      <Image 
        src="/bluebueno.png" 
        alt="Hero" 
        fill 
        className="object-cover opacity-80 scale-110 md:scale-105"
        priority 
      />
      
      {/* Capas de fondo */}
      <div className="absolute inset-0 bg-[#0B2A30]/20 z-[1]" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0B2A30] to-transparent z-[2]" />      
      
      {/* NAV RESPONSIVE */}
      <nav className="absolute top-0 w-full flex justify-between items-center p-6 md:p-10 z-[50]">
        <span className="text-white tracking-[0.3em] md:tracking-[0.5em] uppercase text-[9px] md:text-[10px] font-bold">
          Blue Waves
        </span>
        
        <div className="flex items-center gap-4 md:gap-8">
          {/* Desktop Links */}
          <div className="hidden md:flex gap-8 text-white/70 text-[10px] tracking-widest uppercase font-medium">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className="hover:text-white transition">{link.name}</a>
            ))}
          </div>

          {/* Botón Book Now (Siempre visible en desktop, opcional en móvil) */}
          <button 
            onClick={scrollToContact} 
            className="bg-white text-black px-5 py-2 md:px-6 md:py-2 rounded-full text-[8px] md:text-[9px] font-bold tracking-widest hover:bg-zinc-200 transition shadow-lg"
          >
            BOOK NOW
          </button>

          {/* MENÚ HAMBURGUESA / ANCLA (Móvil) */}
          <button 
            onClick={() => setIsOpen(true)}
            className="md:hidden text-white p-2 border border-white/20 rounded-full bg-white/10 backdrop-blur-md"
          >
            <Anchor size={20} strokeWidth={1.5} className="rotate-12" />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Background blur */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
              className="fixed inset-0 bg-[#0A192F]/80 backdrop-blur-md z-[100] md:hidden"
            />
            {/* Slide menu */}
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
                <span className="text-[8px] tracking-[0.5em] uppercase text-white/30 font-bold">Navigation</span>
                {navLinks.map((link) => (
                  <a 
                    key={link.name} 
                    href={link.href} 
                    onClick={closeMenu}
                    className="text-white font-serif italic text-4xl hover:text-blue-400 transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
                
                <div className="mt-10 pt-10 border-t border-white/10">
                   <button 
                    onClick={() => { closeMenu(); scrollToContact(); }}
                    className="w-full bg-white text-black py-4 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl"
                  >
                    Reservar Ahora
                  </button>
                </div>
              </div>

              <div className="mt-auto">
                 <Anchor size={40} strokeWidth={0.5} className="text-white/10 mx-auto" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* CONTENIDO CENTRAL */}
      <div className="relative z-[10] flex flex-col items-center justify-center h-full text-center px-4">
        <motion.span 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="text-white/60 tracking-[0.4em] md:tracking-[0.8em] uppercase text-[8px] md:text-[9px] mb-4"
        >
          Est. 2026
        </motion.span>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="font-serif text-[18vw] md:text-[12vw] text-white leading-none italic font-light drop-shadow-2xl"
        >
          Blue Waves
        </motion.h1>
      </div>
    </section>
  );
}