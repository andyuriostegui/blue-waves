'use client'
import Image from "next/image";
import { motion } from "framer-motion";
import { Zap, Anchor, Star, ArrowRight } from "lucide-react";

export default function Toys() {
  // Datos de los juguetes
  const toys = [
    { name: "Jet Ski Sea-Doo", desc: "Potencia y adrenalina para explorar la costa.", icon: <Zap size={18} /> },
    { name: "Seabob F5S", desc: "Exploración submarina de lujo con tecnología alemana.", icon: <Anchor size={18} /> },
    { name: "Custom Experience", desc: "Flyboards, E-foils y más bajo solicitud previa.", icon: <Star size={18} /> },
  ];

  // Función para scroll suave al contacto
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 md:py-32 px-6 bg-[#F8F9FA] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
          
          {/* Lado Izquierdo: Imagen de Impacto */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[400px] md:h-[650px] rounded-2xl overflow-hidden shadow-2xl group"
          >
            <Image 
              src="/jetski.png" 
              alt="Luxury Water Toys Experience" 
              fill 
              className="object-cover transition-transform duration-1000 group-hover:scale-110"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority 
            />
            {/* Overlay elegante */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-700" />
            
            {/* Badge de disponibilidad */}
            <div className="absolute bottom-6 left-6 right-6 md:right-auto bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl text-white">
              <p className="text-[8px] md:text-[10px] uppercase tracking-widest font-bold">Available on demand</p>
              <p className="font-serif italic text-base md:text-lg text-white/90">Personalize your charter</p>
            </div>
          </motion.div>

          {/* Lado Derecho: Contenido */}
          <div className="space-y-8 md:space-y-10">
            <header className="space-y-3 md:space-y-4">
              <span className="text-[9px] md:text-[10px] tracking-[0.5em] md:tracking-[0.6em] uppercase text-blue-600 font-black">
                Adrenaline & Luxury
              </span>
              <h2 className="font-serif text-4xl md:text-6xl italic leading-[1.1] text-[#0A192F]">
                Beyond the <br className="hidden md:block" /> Horizon.
              </h2>
            </header>

            <p className="text-zinc-500 font-light text-base md:text-lg leading-relaxed max-w-md">
              Complementen su viaje con nuestra selección curada de <span className="text-[#0A192F] font-medium italic">Water Toys</span>. Desde la velocidad de los Jetskis hasta la exploración silenciosa.
              <br className="hidden md:block" />
              <span className="text-xs font-semibold text-[#0A192F]/70 italic block mt-4">
                * Consulta disponibilidad y precios al realizar tu reservación.
              </span>
            </p>

            {/* Lista de Experiencias */}
            <div className="space-y-6 md:space-y-8 pt-4 md:pt-6">
              {toys.map((toy, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-5 md:gap-6 group cursor-default"
                >
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-white shadow-sm border border-zinc-100 flex items-center justify-center text-zinc-400 group-hover:bg-[#0A192F] group-hover:text-white transition-all duration-500 flex-shrink-0">
                    {toy.icon}
                  </div>
                  <div>
                    <h4 className="font-serif text-lg md:text-xl italic text-[#0A192F] group-hover:translate-x-1 transition-transform duration-300">
                      {toy.name}
                    </h4>
                    <p className="text-xs md:text-sm text-zinc-400 font-light max-w-xs leading-snug">
                      {toy.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* --- BOTÓN DE ACCIÓN CORREGIDO --- */}
            <div className="pt-6 md:pt-10">
              <motion.button 
                onClick={scrollToContact}
                whileHover={{ x: 10 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-4 md:gap-5 group text-[#0A192F]"
              >
                <div className="relative">
                  <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.3em] md:tracking-[0.5em] relative z-10">
                    Solicitar Experiencias
                  </span>
                  <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[#0A192F] origin-left group-hover:scale-x-110 transition-transform duration-500" />
                </div>
                {/* Aquí es donde estaba el error: quitamos el md:size del icono ArrowRight */}
                <div className="p-3 md:p-4 rounded-full bg-[#0A192F] text-white shadow-lg group-hover:bg-blue-600 transition-all duration-500">
                  <ArrowRight size={18} />
                </div>
              </motion.button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}