
'use client'
export const dynamic = 'force-dynamic'

import { Cormorant_Garamond, Inter } from "next/font/google";
import Hero from "@/components/Hero";
import AboutTrust from "@/components/AboutTrust";
import RouteMap from "@/components/RouteMap"; 
import Fleet from "@/components/Fleet";
import Toys from "@/components/Toys";
import ContactForm from "@/components/ContactForm";
import WaveDivider from "@/components/WaveDivider";

// Fuentes Premium
const serif = Cormorant_Garamond({ 
  subsets: ["latin"], 
  weight: ["300", "400", "600"], 
  variable: '--font-serif' 
});

const sans = Inter({ 
  subsets: ["latin"], 
  variable: '--font-sans' 
});

export default function Home() {
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`${serif.variable} ${sans.variable} bg-[#F4F4F4] min-h-screen font-sans text-[#0A192F] selection:bg-[#0A192F] selection:text-white scroll-smooth`}>
      
      {/* LAYOUT FLOW:
          Usamos un contenedor flex-col sin gaps para asegurar 
          que el margen negativo de AboutTrust selle la unión.
      */}
      <main className="flex flex-col">
        
        {/* 1. IMPACTO VISUAL (Termina en #0B2A30) */}
        <Hero scrollToContact={scrollToContact} />
        
        {/* 2. LEGADO Y VIDEO (Empieza en #0B2A30 con -mt-1) */}
        <AboutTrust />

        {/* 3. EXPERIENCIA DE RUTA (Fondo claro #F4F4F4) */}
        <RouteMap />

        {/* --- TRANSICIÓN DE OLA HACIA EL NAVY --- */}
        <WaveDivider color="#0A192F" />

        {/* 4. CATÁLOGO DE LUJO (Fondo Navy #0A192F) */}
        <div className="bg-[#0A192F]">
          <Fleet scrollToContact={scrollToContact} />
        </div>

        {/* --- TRANSICIÓN DE OLA SALIENDO DEL NAVY --- */}
        <WaveDivider color="#0A192F" flip={true} />

        {/* 5. ADRENALINA (Jetskis y Juguetes) */}
        <Toys /> 

        {/* 6. CONVERSIÓN (Formulario Concierge) */}
        <ContactForm />

      </main>
      
      {/* 7. FOOTER */}
      <footer className="py-24 text-center bg-white border-t border-zinc-100">
        <p className="font-serif text-4xl italic mb-6 text-[#0A192F]">Blue Waves</p>
        
        <div className="flex justify-center gap-8 mb-10 text-[9px] tracking-[0.4em] uppercase font-bold text-zinc-400">
          <a href="https://www.instagram.com/bluewavescancun/" className="hover:text-[#0A192F] transition-colors hover:tracking-[0.6em] duration-500 text-zinc-500">Instagram</a>
          <a href="https://www.facebook.com/bluewavescancun/" className="hover:text-[#0A192F] transition-colors hover:tracking-[0.6em] duration-500 text-zinc-500">Facebook</a>
          <a href="mailto:concierge@bluewaves.com" className="hover:text-[#0A192F] transition-colors text-zinc-500">Inquiries</a>
        </div>

        <div className="max-w-xs mx-auto mb-8 h-[1px] bg-zinc-100"></div>

        <p className="text-[9px] tracking-[0.6em] uppercase text-zinc-300">
          © 2026 Blue Waves Maritime Group • Excellence in Yachting
        </p>
      </footer>
    </div>
  );
}