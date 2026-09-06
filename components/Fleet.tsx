'use client'
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Ruler, Users, Wind, Anchor, Maximize2, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "../lib/supabase";

export default function Fleet({ scrollToContact }: { scrollToContact: () => void }) {
  const [yachts, setYachts] = useState<any[]>([]);
  const [selectedYacht, setSelectedYacht] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [loading, setLoading] = useState(true);

  // Touch swipe tracking
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => { fetchYachts(); }, []);

  // Función maestra para cerrar el modal limpiando el historial del celular
  const closeModal = () => {
    setSelectedYacht(null);
    setIsZoomed(false);
    if (window.history.state?.modal === 'abierto') {
      window.history.back();
    }
  };

  useEffect(() => {
    if (selectedYacht) {
      document.body.style.overflow = 'hidden';
      
      // 1. Inyectamos una página falsa para interceptar el botón "Atrás" del celular
      window.history.pushState({ modal: 'abierto' }, '');

      // 2. Escuchamos si el usuario presiona "Atrás" en su cel
      const handlePhoneBackButton = () => {
        setSelectedYacht(null);
        setIsZoomed(false);
      };
      window.addEventListener('popstate', handlePhoneBackButton);

      // 3. Bloquea el swipe-back del navegador en iOS/Android (ignorando botones)
      const preventSwipe = (e: TouchEvent) => {
        if ((e.target as HTMLElement).closest('button')) return; // Ignora si tocan un botón
        if (e.touches[0].clientX < 30 || e.touches[0].clientX > window.innerWidth - 30) {
          e.preventDefault();
        }
      };
      document.addEventListener('touchstart', preventSwipe, { passive: false });

      return () => {
        window.removeEventListener('popstate', handlePhoneBackButton);
        document.removeEventListener('touchstart', preventSwipe);
      };
    } else {
      document.body.style.overflow = 'unset';
      setIsZoomed(false);
      setCurrentImageIndex(0);
    }
  }, [selectedYacht]);

  const nextImage = () => {
    if (!selectedYacht?.images) return;
    setCurrentImageIndex(i => (i + 1) % selectedYacht.images.length);
  };

  const prevImage = () => {
    if (!selectedYacht?.images) return;
    setCurrentImageIndex(i => (i - 1 + selectedYacht.images.length) % selectedYacht.images.length);
  };

  // Handlers de swipe en la galería principal
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      if (dx < 0) nextImage();
      else prevImage();
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  if (loading) {
    return (
      <div className="py-40 text-center bg-[#0A192F] text-white flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-blue-500" size={40} />
        <p className="font-serif italic text-xl tracking-widest">Loading The Collection...</p>
      </div>
    );
  }

  return (
    <section id="fleet" className="py-20 md:py-32 bg-[#0A192F] text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
        <motion.span
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          className="text-[10px] tracking-[0.8em] uppercase text-blue-500 font-black mb-4 block"
        >
          Exclusive Fleet
        </motion.span>
        <h2 className="font-serif text-5xl md:text-8xl italic font-light mb-12 md:mb-20">The Collection</h2>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-12">
          {yachts.map((yacht) => (
            <motion.div
              key={yacht.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group text-left cursor-pointer"
              onClick={() => setSelectedYacht(yacht)}
            >
              <div className="relative h-[240px] md:h-[450px] mb-4 md:mb-8 overflow-hidden bg-zinc-900 shadow-2xl rounded-sm">
                <Image
                  src={(yacht.images && yacht.images.length > 0) ? yacht.images[0] : '/placeholder.png'}
                  alt={yacht.name}
                  fill
                  quality={100}
                  className="object-cover transition-all duration-1000 brightness-[0.8] md:brightness-[0.7] group-hover:brightness-100 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#0A192F]/60" />
                <PriceCorners name={yacht.name} />
                <div className="absolute bottom-0 p-8 w-full translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 hidden md:block">
                  <button type="button" className="w-full py-4 bg-white text-black text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 hover:text-white transition-colors">
                    Explore Vessel
                  </button>
                </div>
              </div>
              <h4 className="font-serif text-lg md:text-3xl font-light tracking-tight group-hover:text-blue-400 transition-colors truncate px-1">
                {yacht.name}
              </h4>
              <p className="text-[8px] md:text-[10px] tracking-[0.2em] md:tracking-[0.4em] uppercase text-zinc-500 font-bold mt-1 md:mt-2 px-1">
                {yacht.size} • Luxury Charter
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {selectedYacht && (
          <div
            ref={modalRef}
            style={{ touchAction: 'none' }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6 overflow-hidden"
          >
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-black/98 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              style={{ touchAction: 'pan-y' }}
              className="relative w-full h-full md:h-[90vh] md:max-w-7xl bg-white text-black overflow-hidden flex flex-col md:flex-row shadow-2xl"
            >
              {/* Botón cerrar */}
              <button
                type="button"
                onClick={closeModal}
                className="absolute top-4 right-4 z-[110] p-2.5 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/70 transition-colors"
              >
                <X className="w-6 h-6" strokeWidth={1.5} />
              </button>

              {/* GALERÍA con swipe táctil */}
              <div
                className="relative w-full md:w-[65%] h-[45vh] md:h-full bg-[#111] flex flex-col"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                style={{ touchAction: 'pan-x' }}
              >
                <div
                  className="relative flex-1 w-full overflow-hidden cursor-zoom-in group"
                  onClick={() => setIsZoomed(true)}
                >
                  <Image
                    src={selectedYacht.images?.[currentImageIndex] || '/placeholder.png'}
                    alt={selectedYacht.name}
                    fill
                    className="object-cover transition-opacity duration-500"
                    priority
                    unoptimized
                  />
                  <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
                  <PriceCorners name={selectedYacht.name} avoidClose />

                  {/* Flechas de navegación */}
                  {selectedYacht.images?.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); prevImage(); }}
                        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/40 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors md:opacity-0 md:group-hover:opacity-100"
                      >
                        <ChevronLeft size={22} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); nextImage(); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/40 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors md:opacity-0 md:group-hover:opacity-100"
                      >
                        <ChevronRight size={22} />
                      </button>
                    </>
                  )}

                  {/* Indicador de imagen actual en móvil */}
                  {selectedYacht.images?.length > 1 && (
                    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-1.5 md:hidden z-20">
                      {selectedYacht.images.map((_: any, i: number) => (
                        <div
                          key={i}
                          className={`h-1 rounded-full transition-all duration-300 ${i === currentImageIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40'}`}
                        />
                      ))}
                    </div>
                  )}

                  <div className="absolute bottom-6 right-6 bg-black/40 backdrop-blur-md p-3 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex">
                    <Maximize2 size={20} />
                  </div>
                </div>

                {/* Thumbnails — solo desktop */}
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="hidden md:flex absolute bottom-6 left-1/2 -translate-x-1/2 gap-3 px-4 py-3 bg-black/30 backdrop-blur-xl rounded-2xl max-w-[90%] overflow-x-auto scrollbar-hide z-20 shadow-2xl border border-white/10"
                >
                  {selectedYacht.images?.map((img: string, index: number) => (
                    <div
                      key={index}
                      className={`relative h-16 w-16 flex-shrink-0 cursor-pointer rounded-lg overflow-hidden transition-all duration-300 border-2 ${index === currentImageIndex ? 'border-blue-500 scale-105 shadow-lg' : 'border-transparent opacity-40 hover:opacity-80'}`}
                      onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(index); }}
                    >
                      <Image src={img} alt="thumb" fill className="object-cover" unoptimized />
                    </div>
                  ))}
                </div>
              </div>

              {/* PANEL INFO */}
              <div
                style={{ touchAction: 'pan-y' }}
                className="w-full md:w-[35%] p-6 md:p-12 flex flex-col justify-between overflow-y-auto bg-white border-l border-zinc-100"
              >
                <div className="space-y-6 md:space-y-8">
                  <div>
                    <span className="text-[9px] md:text-[10px] tracking-[0.5em] text-blue-600 uppercase font-black">Vessel Specifications</span>
                    <h2 className="font-serif text-3xl md:text-5xl italic text-[#0A192F] mt-2 mb-4 md:mb-6 leading-tight">{selectedYacht.name}</h2>
                    <div className="h-1 w-12 bg-blue-600 mb-6 md:mb-8" />
                  </div>
                  <div className="max-h-[120px] md:max-h-[300px] overflow-y-auto pr-2">
                    <p className="text-zinc-600 font-light leading-relaxed text-sm md:text-base whitespace-pre-line">
                      {selectedYacht.description}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-6 md:gap-x-6 md:gap-y-10 border-t border-zinc-100 pt-6 md:pt-10">
                    <SpecItem label="Length" value={selectedYacht.size} icon={<Ruler size={16} />} />
                    <SpecItem label="Capacity" value={`${selectedYacht.capacity} Guests`} icon={<Users size={16} />} />
                    <SpecItem label="Cabins" value={`${selectedYacht.cabins} Rooms`} icon={<Wind size={16} />} />
                    <SpecItem label="Bathrooms" value={`${selectedYacht.bathrooms} WC`} icon={<Anchor size={16} />} />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => { closeModal(); scrollToContact(); }}
                  className="mt-8 md:mt-12 w-full bg-[#0A192F] text-white py-5 md:py-6 text-[10px] md:text-[11px] font-bold tracking-[0.4em] uppercase hover:bg-blue-600 transition-all shadow-2xl flex items-center justify-center gap-4 group"
                >
                  Book This Experience
                  <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>→</motion.span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ZOOM MODAL */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ touchAction: 'none' }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setIsZoomed(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
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
            {/* Flechas en zoom */}
            {selectedYacht.images?.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); prevImage(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors"
                >
                  <ChevronLeft size={28} />
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); nextImage(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors"
                >
                  <ChevronRight size={28} />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function normalizeYachtName(name: string) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function getYachtPrice(name: string): number | null {
  const n = normalizeYachtName(name);

  if (n.includes('mavie')) return 15000;
  if (n.includes('seafari')) return 19000;
  if (n.includes('san remo') || n.includes('sunseeker')) return 20000;
  if (n.includes('pershing') || n.includes('principe')) return 32000;
  if (n.includes('vive') || n.includes('dyna')) return 72000;
  if (n.includes('golden')) return null;
  if (n.includes('azimut')) return 114000;
  return null;
}

function PriceCorners({ name, avoidClose = false }: { name: string; avoidClose?: boolean }) {
  const mxn = getYachtPrice(name);
  if (!mxn) return null;

  return (
    <div
      className={`absolute top-2.5 md:top-5 z-10 pointer-events-none text-right ${
        avoidClose ? 'right-14 md:right-5' : 'right-2.5 md:right-5'
      }`}
    >
      <p className="text-[7px] md:text-[10px] tracking-[0.42em] uppercase text-white font-bold drop-shadow-[0_1px_8px_rgba(0,0,0,0.9)]">
        MXN
      </p>
      <p
        className="font-serif italic text-white text-[17px] md:text-[32px] leading-none mt-0.5"
        style={{ textShadow: '0 2px 14px rgba(0,0,0,0.85), 0 0 22px rgba(255,255,255,0.28)' }}
      >
        ${mxn.toLocaleString('es-MX')}
      </p>
    </div>
  );
}

function SpecItem({ label, value, icon }: any) {
  return (
    <div className="flex items-center gap-3 md:gap-4 group">
      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-zinc-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm border border-zinc-100 flex-shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[7px] md:text-[8px] uppercase tracking-[0.1em] md:tracking-[0.2em] text-zinc-400 mb-0.5 font-bold truncate">{label}</p>
        <p className="text-[10px] md:text-sm font-bold text-[#0A192F] uppercase truncate">{value}</p>
      </div>
    </div>
  );
}