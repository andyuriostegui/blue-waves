'use client'
import Image from "next/image";
import { motion } from "framer-motion";

export default function Hero({ scrollToContact }: { scrollToContact: () => void }) {
  return (
    // Cambiamos el fondo base al Teal Caribeño
    <section className="relative h-screen w-full overflow-hidden bg-[#0B2A30]">
      <Image 
        src="/blue.png" 
        alt="Hero" 
        fill 
        className="object-cover opacity-80 scale-105" 
        priority 
      />
      
      {/* 1. Capa de color turquesa sutil para unificar la imagen */}
      <div className="absolute inset-0 bg-[#0B2A30]/20 z-1" />

      {/* 2. EL DEGRADADO CLAVE: Ahora va hacia el Teal Caribeño */}
{/* Cambia el div del degradado por este: */}
<div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0B2A30] to-transparent z-2" />      
      <nav className="absolute top-0 w-full flex justify-between items-center p-10 z-30">
        <span className="text-white tracking-[0.5em] uppercase text-[10px] font-bold">Blue Waves</span>
        <div className="flex gap-8 text-white/70 text-[10px] tracking-widest uppercase font-medium">
          <a href="#fleet" className="hover:text-white transition">Fleet</a>
          <a href="#about" className="hover:text-white transition">About Us</a>
          <a href="#journey" className="hover:text-white transition">Journey</a>
          <button onClick={scrollToContact} className="bg-white text-black px-6 py-2 rounded-full text-[9px] font-bold tracking-widest hover:bg-zinc-200 transition">Book Now</button>
        </div>
      </nav>

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white/60 tracking-[0.8em] uppercase text-[9px] mb-4">Est. 2026</motion.span>
        {/* Agregamos una sombra de texto para que resalte sobre el color caribeño */}
        <motion.h1 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="font-serif text-[12vw] text-white leading-none italic font-light drop-shadow-xl"
        >
          Blue Waves
        </motion.h1>
      </div>
    </section>
  );
}