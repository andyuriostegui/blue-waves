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
    <section id="journey" className="py-32 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* --- LADO IZQUIERDO: EL MAPA VISUAL --- */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7 relative"
          >
            <div className="relative h-[650px] w-full rounded-sm overflow-hidden bg-[#f8f9fa] border border-zinc-100 shadow-2xl">
              {/* Asegúrate de que ruta.jpg esté en tu carpeta public */}
              <Image 
                src="/ruta.jpg" 
                alt="Bespoke Route Map" 
                fill 
                className="object-contain p-12 opacity-90 transition-transform duration-[5s] hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
              
              {/* Overlay decorativo de carta náutica */}
              <div className="absolute inset-0 bg-[#0A192F]/5 pointer-events-none" />
              <div className="absolute top-8 left-8 border-l border-t border-zinc-200 w-20 h-20 pointer-events-none" />
              <div className="absolute bottom-8 right-8 border-r border-b border-zinc-200 w-20 h-20 pointer-events-none" />
            </div>

            {/* Cuadro informativo flotante (Estilo Old Money) */}
            <div className="absolute -bottom-8 -right-8 bg-[#0A192F] text-white p-10 rounded-sm shadow-[20px_20px_40px_rgba(0,0,0,0.3)] hidden md:block max-w-[280px]">
              <Navigation className="mb-6 text-blue-400" size={32} strokeWidth={1.5} />
              <p className="text-[9px] uppercase tracking-[0.4em] font-bold text-white/50 mb-2">Primary Route</p>
              <h4 className="font-serif text-3xl italic leading-tight mb-4">Mexican Caribbean</h4>
              <p className="text-[10px] leading-relaxed text-white/60 font-light">
                Our itineraries are curated to avoid crowds and maximize privacy.
              </p>
            </div>
          </motion.div>

          {/* --- LADO DERECHO: ITINERARIO --- */}
          <div className="lg:col-span-5 space-y-12">
            <div>
              <span className="text-[9px] tracking-[0.6em] uppercase text-zinc-400 font-bold mb-4 block">Navigation</span>
              <h2 className="font-serif text-6xl italic leading-[1.1] text-[#0A192F]">Tailored <br /> Experiences.</h2>
            </div>

            <div className="space-y-12">
              {stops.map((stop, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-8 group"
                >
                  <span className="font-serif text-3xl italic text-zinc-200 group-hover:text-[#0A192F] transition-colors duration-500">
                    {stop.point}
                  </span>
                  <div className="space-y-2 border-l border-zinc-100 pl-8 group-hover:border-[#0A192F] transition-all duration-500">
                    <h4 className="font-bold text-[10px] uppercase tracking-[0.3em] text-[#0A192F]">
                      {stop.name}
                    </h4>
                    <p className="text-sm text-zinc-400 font-light leading-relaxed max-w-sm">
                      {stop.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="pt-10 flex items-center gap-4 text-[#0A192F]/40 italic">
               <Anchor size={14} />
               <p className="text-[10px] tracking-widest uppercase font-medium">Customizable Charters Available</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}