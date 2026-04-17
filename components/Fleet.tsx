'use client'
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Ruler, Users, Wind, Anchor, Maximize2, Loader2 } from "lucide-react";
import { supabase } from "../lib/supabase";

export default function Fleet({ scrollToContact }: { scrollToContact: () => void }) {
  const [yachts, setYachts] = useState<any[]>([]);
  const [selectedYacht, setSelectedYacht] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchYachts = async () => {
    try {
      const { data, error } = await supabase
        .from('yachts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setYachts(data);
    } catch (error) {
      console.error("Error cargando la flota:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchYachts();
  }, []);

  useEffect(() => {
    if (selectedYacht) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setIsZoomed(false);
      setCurrentImageIndex(0);
    }
  }, [selectedYacht]);

  if (loading) {
    return (
      <div className="py-40 text-center bg-[#0A192F] text-white flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-blue-500" size={40} />
        <p className="font-serif italic text-xl">Loading The Collection...</p>
      </div>
    );
  }

  return (
    <section id="fleet" className="py-20 md:py-32 bg-[#0A192F] text-white">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.span 
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          className="text-[10px] tracking-[0.8em] uppercase text-blue-500 font-black mb-4 block"
        >
          Exclusive Fleet
        </motion.span>
        <h2 className="font-serif text-5xl md:text-8xl italic font-light mb-12 md:mb-20">The Collection</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {yachts.map((yacht) => (
            <motion.div 
              key={yacht.id} 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              className="group text-left" 
              onClick={() => setSelectedYacht(yacht)}
            >
              <div className="relative h-[450px] mb-8 overflow-hidden bg-zinc-900 shadow-2xl cursor-pointer rounded-sm">
                <Image 
                  src={(yacht.images && yacht.images.length > 0) ? yacht.images[0] : '/placeholder.png'} 
                  alt={yacht.name} 
                  fill 
                  quality={100}
                  className="object-cover transition-all duration-1000 brightness-[0.7] group-hover:brightness-100 group-hover:scale-110" 
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-0 p-8 w-full translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <button className="w-full py-4 bg-white text-black text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 hover:text-white transition-colors">
                    Explore Vessel
                  </button>
                </div>
              </div>
              <h4 className="font-serif text-3xl font-light tracking-tight group-hover:text-blue-400 transition-colors">{yacht.name}</h4>
              <p className="text-[10px] tracking-[0.4em] uppercase text-zinc-500 font-bold mt-2">{yacht.size} • Luxury Charter</p>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedYacht && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6 overflow-hidden">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedYacht(null)} className="absolute inset-0 bg-black/98 backdrop-blur-md" />

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full h-full md:h-[90vh] md:max-w-7xl bg-white text-black overflow-hidden flex flex-col md:flex-row shadow-2xl"
            >
              <button onClick={() => setSelectedYacht(null)} className="absolute top-6 right-6 z-[110] p-2 bg-black/10 backdrop-blur-md rounded-full text-white md:text-zinc-500 hover:text-black transition-colors">
                <X className="w-8 h-8" strokeWidth={1} />
              </button>

              {/* GALERÍA */}
              <div className="relative w-full md:w-[65%] h-[45vh] md:h-full bg-[#111] flex flex-col">
                <div className="relative flex-1 w-full overflow-hidden cursor-zoom-in group" onClick={() => setIsZoomed(true)}>
                  <Image 
                    src={selectedYacht.images?.[currentImageIndex] || '/placeholder.png'} 
                    alt={selectedYacht.name} 
                    fill 
                    quality={100}
                    className="object-cover transition-opacity duration-500" 
                    priority 
                    unoptimized
                  />
                  <div className="absolute bottom-6 right-6 bg-black/40 backdrop-blur-md p-3 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 size={20} />
                  </div>
                </div>

                {/* MINIATURAS */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 px-4 py-3 bg-black/30 backdrop-blur-xl rounded-2xl max-w-[90%] overflow-x-auto scrollbar-hide z-20 shadow-2xl border border-white/10">
                  {selectedYacht.images?.map((img: string, index: number) => (
                    <div 
                      key={index} 
                      className={`relative h-14 w-14 md:h-16 md:w-16 flex-shrink-0 cursor-pointer rounded-lg overflow-hidden transition-all duration-300 border-2 ${index === currentImageIndex ? 'border-blue-500 scale-110 shadow-lg' : 'border-transparent opacity-40 hover:opacity-80'}`} 
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      <Image src={img} alt="thumb" fill className="object-cover" unoptimized />
                    </div>
                  ))}
                </div>
              </div>

              {/* INFO */}
              <div className="w-full md:w-[35%] p-8 md:p-12 flex flex-col justify-between overflow-y-auto bg-white border-l border-zinc-100">
                <div className="space-y-8">
                  <div>
                    <span className="text-[10px] tracking-[0.5em] text-blue-600 uppercase font-black">Vessel Specifications</span>
                    <h2 className="font-serif text-5xl italic text-[#0A192F] mt-2 mb-6 leading-tight">{selectedYacht.name}</h2>
                    <div className="h-1 w-12 bg-blue-600 mb-8" />
                  </div>

                  <div className="max-h-[300px] overflow-y-auto pr-4 scrollbar-thin">
                    <p className="text-zinc-600 font-light leading-relaxed text-base whitespace-pre-line">
                      {selectedYacht.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-x-6 gap-y-10 border-t border-zinc-100 pt-10">
                    <SpecItem label="Length" value={selectedYacht.size} icon={<Ruler size={16}/>} />
                    <SpecItem label="Capacity" value={`${selectedYacht.capacity} Guests`} icon={<Users size={16}/>} />
                    <SpecItem label="Cabins" value={`${selectedYacht.cabins} Rooms`} icon={<Wind size={16}/>} />
                    <SpecItem label="Bathrooms" value={`${selectedYacht.bathrooms} WC`} icon={<Anchor size={16}/>} />
                  </div>
                </div>

                <button 
                  onClick={() => { setSelectedYacht(null); scrollToContact(); }}
                  className="mt-12 w-full bg-[#0A192F] text-white py-6 text-[11px] font-bold tracking-[0.4em] uppercase hover:bg-blue-600 transition-all shadow-2xl flex items-center justify-center gap-4 group"
                >
                  Book This Experience
                  <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>→</motion.span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- LIGHTBOX --- */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out" 
            onClick={() => setIsZoomed(false)}
          >
            <div className="relative w-full h-full max-w-7xl">
              <Image 
                src={selectedYacht.images?.[currentImageIndex] || '/placeholder.png'} 
                alt="Zoom" 
                fill 
                className="object-contain" 
                unoptimized
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function SpecItem({ label, value, icon }: any) {
  return (
    <div className="flex items-center gap-4 group">
      <div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm border border-zinc-100">
        {icon}
      </div>
      <div>
        <p className="text-[8px] uppercase tracking-[0.2em] text-zinc-400 mb-0.5 font-bold">{label}</p>
        <p className="text-sm font-bold text-[#0A192F] uppercase">{value}</p>
      </div>
    </div>
  );
}