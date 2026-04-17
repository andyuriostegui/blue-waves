'use client'
import Image from "next/image";
import { motion } from "framer-motion";
import { Navigation, Anchor } from "lucide-react";

export default function RouteMap() {
  const stops = [
    { point: "01", name: "Puerto Cancún", desc: "Departure from the heart of the luxury district." },
    { point: "02", name: "Isla Mujeres", desc: "Turquoise waters and private beach club access." },
    { point: "03", name: "Punta Sur", desc: "Cliffs and ancient Mayan ruins viewed from the sea." },
    { point: "04", name: "Playa Norte", desc: "Sunset cocktails in the world's finest shallow waters." },
  ];

  return (
    <section id="journey" className="py-16 md:py-32 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 items-center">
          
          {/* --- LADO IZQUIERDO: EL MAPA VISUAL --- */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7 relative w-full"
          >
            <div className="relative h-[250px] sm:h-[350px] md:h-[600px] w-full rounded-sm overflow-hidden bg-[#f8f9fa] border border-zinc-100 shadow-2xl">
              <Image 
                src="/ruta.jpg" 
                alt="Bespoke Route Map" 
                fill 
                className="object-contain p-2 md:p-12 opacity-95 transition-transform duration-[5s] hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
              
              <div className="absolute inset-0 bg-[#0A192F]/5 pointer-events-none" />
              <div className="absolute top-4 left-4 border-l border-t border-zinc-200 w-10 h-10 pointer-events-none" />
              <div className="absolute bottom-4 right-4 border-r border-b border-zinc-200 w-10 h-10 pointer-events-none" />
            </div>

            {/* CUADRO INFORMATIVO: CORREGIDO */}
            <div className="relative -mt-12 mx-auto md:absolute md:-bottom-8 md:-right-8 md:mt-0 bg-[#0A192F] text-white p-6 md:p-10 rounded-sm shadow-2xl z-20 w-[85%] md:w-[280px]">
              {/* QUITAMOS md:size AQUÍ ABAJO */}
              <Navigation className="mb-4 text-blue-400" size={28} strokeWidth={1.5} />
              <p className="text-[7px] md:text-[9px] uppercase tracking-[0.4em] font-bold text-white/50 mb-1 md:mb-2">Primary Route</p>
              <h4 className="font-serif text-xl md:text-3xl italic leading-tight mb-2 md:mb-4">Mexican Caribbean</h4>
              <p className="text-[9px] md:text-[10px] leading-relaxed text-white/60 font-light">
                Our itineraries are curated to avoid crowds and maximize privacy.
              </p>
            </div>
          </motion.div>

          {/* --- LADO DERECHO: ITINERARIO --- */}
          <div className="lg:col-span-5 space-y-10 md:space-y-12 mt-16 md:mt-0 px-2 md:px-0">
            <div>
              <span className="text-[8px] md:text-[9px] tracking-[0.6em] uppercase text-zinc-400 font-bold mb-3 md:mb-4 block">Navigation</span>
              <h2 className="font-serif text-4xl md:text-6xl italic leading-[1.1] text-[#0A192F]">
                Tailored <br className="hidden md:block" /> Experiences.
              </h2>
            </div>

            <div className="space-y-8 md:space-y-12">
              {stops.map((stop, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-6 md:gap-8 group"
                >
                  <span className="font-serif text-2xl md:text-3xl italic text-zinc-200 group-hover:text-[#0A192F] transition-colors duration-500">
                    {stop.point}
                  </span>
                  <div className="space-y-1 md:space-y-2 border-l border-zinc-100 pl-6 md:pl-8 group-hover:border-[#0A192F] transition-all duration-500">
                    <h4 className="font-bold text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-[#0A192F]">
                      {stop.name}
                    </h4>
                    <p className="text-xs md:text-sm text-zinc-400 font-light leading-relaxed max-w-sm">
                      {stop.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="pt-6 md:pt-10 flex items-center gap-4 text-[#0A192F]/40 italic">
               {/* TAMBIÉN CORREGIMOS EL ANCHOR */}
               <Anchor size={16} />
               <p className="text-[9px] md:text-[10px] tracking-widest uppercase font-medium">Customizable Charters Available</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}