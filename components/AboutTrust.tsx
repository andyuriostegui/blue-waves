'use client'
import { motion } from "framer-motion";
import { ShieldCheck, Award, Anchor, Users } from "lucide-react";

export default function AboutTrust() {
  const badges = [
    { icon: <ShieldCheck size={28} strokeWidth={1} />, title: "Certified Safety", desc: "IMO & Coast Guard regulated vessels." },
    { icon: <Award size={28} strokeWidth={1} />, title: "Expert Crew", desc: "Master captains with global licenses." },
    { icon: <Anchor size={28} strokeWidth={1} />, title: "Pristine Fleet", desc: "Daily specialized technical maintenance." },
    { icon: <Users size={28} strokeWidth={1} />, title: "VIP Service", desc: "100% bespoke concierge experience." }
  ];

  return (
    /* USAMOS -mt-1 PARA PISAR AL HERO Y BORRAR LA LÍNEA. 
      CAMBIAMOS z-index A z-10 PARA QUE ESTÉ POR ENCIMA DEL HERO.
    */
    <section className="relative py-40 px-6 bg-[#0B2A30] overflow-hidden -mt-1 z-10">
      
      {/* --- VIDEO DE FONDO FUSIONADO --- */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-70 scale-110"
          style={{
            /* IMPORTANTE: El white 15% asegura que arriba empiece sólido 
               para recibir el color del Hero sin transparencia.
            */
            maskImage: 'linear-gradient(to bottom, white 0%, white 15%, white 85%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, white 0%, white 15%, white 85%, transparent 100%)',
          }}
        >
          <source src="/olas.mp4" type="video/mp4" />
        </video>

        {/* ESTA CAPA ES EL PEGAMENTO: 
           from-[#0B2A30] debe ser idéntico al color final del Hero.
        */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B2A30] via-transparent to-[#F4F4F4] z-1" />
      </div>

      {/* --- CONTENIDO --- */}
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-start">
          
          {/* LADO IZQUIERDO: TEXTO */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 space-y-10"
          >
            <span className="text-[9px] tracking-[0.8em] uppercase text-white/50 font-bold block">
              The Heritage
            </span>
            
            <h2 
              className="font-serif text-6xl italic text-white leading-[1.1]"
              style={{ textShadow: '0 4px 12px rgba(0,0,0,0.4)' }}
            >
              Beyond the <br /> Nautical Standard.
            </h2>
            
            <p className="text-white/70 font-light text-xl leading-relaxed max-w-lg italic">
              "We curate <span className="text-white font-medium not-italic">private sanctuaries</span> where the horizon is your only limit."
            </p>
            <div className="pt-6 border-t border-white/20 max-w-[150px]">
              <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-white">Est. 2026</p>
            </div>
          </motion.div>

          {/* LADO DERECHO: BADGES */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-20 pt-10 md:pt-0">
            {badges.map((badge, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col space-y-5"
              >
                <div className="text-white p-4 w-16 h-16 rounded-full border border-white/20 bg-white/10 backdrop-blur-xl flex items-center justify-center shadow-2xl">
                  {badge.icon}
                </div>
                
                <div>
                  <h3 className="text-[11px] uppercase tracking-[0.5em] font-bold text-white pt-2">
                    {badge.title}
                  </h3>
                  <p className="text-white/50 text-sm font-light leading-relaxed max-w-sm">
                    {badge.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}