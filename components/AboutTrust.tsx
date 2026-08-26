'use client'
import { motion } from "framer-motion";
import { ShieldCheck, Award, Anchor, Users } from "lucide-react";
import { useI18n } from "@/components/LocaleProvider";

export default function AboutTrust() {
  const { dict } = useI18n();
  const icons = [
    <ShieldCheck key="safety" size={28} strokeWidth={1} />,
    <Award key="crew" size={28} strokeWidth={1} />,
    <Anchor key="fleet" size={28} strokeWidth={1} />,
    <Users key="vip" size={28} strokeWidth={1} />,
  ];

  return (
    <section id="about" className="relative py-24 md:py-40 px-6 bg-[#0B2A30] overflow-hidden -mt-1 z-10">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-60 md:opacity-70 scale-110"
          style={{
            maskImage: 'linear-gradient(to bottom, white 0%, white 15%, white 85%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, white 0%, white 15%, white 85%, transparent 100%)',
          }}
        >
          <source src="/olas.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-b from-[#0B2A30] via-transparent to-[#F4F4F4]/20 z-1" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24 items-start">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 space-y-6 md:space-y-10"
          >
            <span className="text-[8px] md:text-[9px] tracking-[0.5em] md:tracking-[0.8em] uppercase text-white/50 font-bold block">
              {dict.about.kicker}
            </span>
            
            <h2 
              className="font-serif text-4xl md:text-6xl italic text-white leading-[1.2] md:leading-[1.1]"
              style={{ textShadow: '0 4px 12px rgba(0,0,0,0.4)' }}
            >
              {dict.about.titleBefore} <br className="hidden md:block" /> {dict.about.titleAfter}
            </h2>
            
            <p className="text-white/70 font-light text-lg md:text-xl leading-relaxed max-w-lg italic">
              {dict.about.quoteBefore}{' '}
              <span className="text-white font-medium not-italic">{dict.about.quoteEm}</span>
            </p>
            <p className="text-white/75 font-light text-sm md:text-base leading-relaxed max-w-lg">
              {dict.about.body}
            </p>
            <div className="pt-6 border-t border-white/20 max-w-[120px] md:max-w-[150px]">
              <p className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] font-bold text-white">{dict.about.established}</p>
            </div>
          </motion.div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-x-12 md:gap-x-16 gap-y-12 md:gap-y-20 pt-10 lg:pt-0">
            {dict.about.badges.map((badge, i) => (
              <motion.div 
                key={badge.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col space-y-4 md:space-y-5"
              >
                <div className="text-white p-4 w-14 h-14 md:w-16 md:h-16 rounded-full border border-white/20 bg-white/10 backdrop-blur-xl flex items-center justify-center shadow-2xl">
                  <div className="scale-90 md:scale-100">
                    {icons[i]}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-[10px] md:text-[11px] uppercase tracking-[0.4em] md:tracking-[0.5em] font-bold text-white pt-2">
                    {badge.title}
                  </h3>
                  <p className="text-white/50 text-xs md:text-sm font-light leading-relaxed max-w-sm">
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
