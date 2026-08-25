'use client'
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from '@/lib/supabase';
import { Loader2, CheckCircle2, ChevronDown } from 'lucide-react';
import BookingCalendar from './BookingCalendar';
import {
  buildInquiryWhatsAppMessage,
  getWhatsAppUrl,
  localDateToIso,
} from '@/lib/site';

type VesselOption = {
  name: string
  size?: string | null
}

export default function ContactForm({
  preselectedYacht = '',
  yachts = [],
  yachtsLoaded = false,
}: {
  preselectedYacht?: string
  yachts?: VesselOption[]
  yachtsLoaded?: boolean
}) {
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [whatsappHref, setWhatsappHref] = useState('');

  const yachtList = yachts
    .map((yacht) => ({
      name: String(yacht.name ?? '').trim(),
      size: yacht.size,
    }))
    .filter((yacht) => yacht.name.length > 0);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    service_type: '',
    budget: '4 Hours (Half Day)',
    notes: '',
    booking_date: ''
  });

  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get('yate');
    const next = (fromUrl || preselectedYacht || '').trim();
    if (!next) return;
    setFormData((prev) => ({ ...prev, service_type: next }));
  }, [preselectedYacht]);

  // Manejador para actualizar la fecha desde el componente BookingCalendar
  const handleDateChange = (date: Date | undefined) => {
    setFormData(prev => ({
      ...prev,
      booking_date: date ? localDateToIso(date) : ''
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const saveLead = async () => {
    const { error } = await supabase.from('leads').insert([{
      full_name: formData.full_name,
      email: formData.email,
      phone: formData.phone,
      service_type: formData.service_type,
      budget: formData.budget,
      notes: formData.notes,
      booking_date: formData.booking_date || null,
      status: 'nuevo',
    }]);

    if (error) {
      console.error('No se pudo guardar el lead en el CRM:', error.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const url = getWhatsAppUrl(buildInquiryWhatsAppMessage(formData));
    setWhatsappHref(url);

    // Abrir WhatsApp en el mismo gesto del usuario (si esperamos al CRM, iOS bloquea el popup).
    // No usar "noopener" en windowFeatures: el popup devolvería null y redirigiría esta pestaña.
    const popup = window.open(url, '_blank');
    if (popup) popup.opener = null;

    try {
      await saveLead();
    } catch (error) {
      console.error('Error:', error);
    }

    if (!popup) {
      window.location.href = url;
      return;
    }

    setIsSuccess(true);
    setLoading(false);
  };

  return (
    <section id="contact" className="py-20 md:py-32 px-6 bg-[#F9FAFB] relative overflow-hidden">
      
      {/* TEXTO DECORATIVO */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.02] md:opacity-[0.03] select-none">
        <h2 className="text-[50vw] md:text-[30vw] font-serif italic text-[#0A192F] leading-none text-center">Inquiry</h2>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16 md:mb-24">
          <span className="text-[8px] md:text-[9px] tracking-[0.6em] md:tracking-[0.8em] uppercase text-zinc-400 font-bold mb-3 md:mb-4 block">Concierge</span>
          <h2 className="font-serif text-4xl md:text-7xl italic text-[#0A192F] leading-tight px-4">Start Your Journey</h2>
          <p className="mt-4 text-sm font-light text-zinc-500 px-4">
            Cotiza tu renta de yate en Cancún. El concierge responde por WhatsApp.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.form 
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onSubmit={handleSubmit} 
              className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10 md:gap-y-16"
            >
              {/* Inputs */}
              <div className="flex flex-col border-b border-zinc-300 pb-2 focus-within:border-[#0A192F] transition-all duration-500">
                <label className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.4em] text-zinc-400 font-bold mb-2 md:mb-3">Full Name</label>
                <input name="full_name" type="text" autoComplete="name" placeholder="Julianne Moore" required onChange={handleChange} className="bg-transparent outline-none font-serif text-xl md:text-2xl italic text-[#0A192F] placeholder:text-zinc-200" />
              </div>

              <div className="flex flex-col border-b border-zinc-300 pb-2 focus-within:border-[#0A192F] transition-all duration-500">
                <label className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.4em] text-zinc-400 font-bold mb-2 md:mb-3">Email Address</label>
                <input name="email" type="email" autoComplete="email" placeholder="client@luxury.com" required onChange={handleChange} className="bg-transparent outline-none font-serif text-xl md:text-2xl italic text-[#0A192F] placeholder:text-zinc-200" />
              </div>

              <div className="flex flex-col border-b border-zinc-300 pb-2 focus-within:border-[#0A192F] transition-all duration-500">
                <label className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.4em] text-zinc-400 font-bold mb-2 md:mb-3">Phone Number</label>
                <input name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="+52 998 000 0000" required onChange={handleChange} className="bg-transparent outline-none font-serif text-xl md:text-2xl italic text-[#0A192F] placeholder:text-zinc-200" />
              </div>

              {/* Selects */}
              <div className="flex flex-col border-b border-zinc-300 pb-2 relative">
                <label className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.4em] text-zinc-400 font-bold mb-2 md:mb-3">Embarcación</label>
                <select
                  name="service_type"
                  required
                  value={formData.service_type}
                  onChange={handleChange}
                  className="bg-transparent outline-none font-serif text-xl md:text-2xl italic text-[#0A192F] appearance-none cursor-pointer pr-10"
                >
                  <option value="" disabled>
                    {!yachtsLoaded ? 'Cargando flota...' : 'Selecciona un yate'}
                  </option>
                  {formData.service_type &&
                  formData.service_type !== 'Aún no decido' &&
                  !yachtList.some((yacht) => yacht.name === formData.service_type) ? (
                    <option value={formData.service_type}>{formData.service_type}</option>
                  ) : null}
                  {yachtList.map((yacht) => (
                    <option key={yacht.name} value={yacht.name}>
                      {yacht.size ? `${yacht.name} · ${yacht.size}` : yacht.name}
                    </option>
                  ))}
                  <option value="Aún no decido">Aún no decido</option>
                </select>
                <ChevronDown className="absolute bottom-3 right-0 w-4 h-4 text-zinc-300 pointer-events-none" />
              </div>

              <div className="flex flex-col border-b border-zinc-300 pb-2 relative">
                <label className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.4em] text-zinc-400 font-bold mb-2 md:mb-3">Charter Duration</label>
                <select
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className="bg-transparent outline-none font-serif text-xl md:text-2xl italic text-[#0A192F] appearance-none cursor-pointer pr-10"
                >
                  <option value="4 Hours (Half Day)">4 Hours (Half Day)</option>
                  <option value="6 Hours (Extended)">6 Hours (Extended)</option>
                  <option value="8 Hours (Full Day)">8 Hours (Full Day)</option>
                </select>
                <ChevronDown className="absolute bottom-3 right-0 w-4 h-4 text-zinc-300 pointer-events-none" />
              </div>

              {/* CALENDARIO INTEGRADO INTEGRALMENTE */}
              <div className="md:col-span-2 flex flex-col items-center mt-6">
                <BookingCalendar onDateChange={handleDateChange} />
              </div>

              <div className="md:col-span-2 flex flex-col border-b border-zinc-300 pb-2 focus-within:border-[#0A192F] transition-all duration-500">
                <label className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.4em] text-zinc-400 font-bold mb-2 md:mb-3">Special Notes</label>
                <textarea name="notes" rows={1} placeholder="Dietary preferences, security, etc." onChange={handleChange} className="bg-transparent outline-none font-serif text-xl md:text-2xl italic text-[#0A192F] placeholder:text-zinc-200 resize-none min-h-[40px]" />
              </div>

              <div className="md:col-span-2 flex justify-center mt-10 md:mt-16">
                <motion.button 
                  whileHover={{ scale: 1.02, backgroundColor: "#1a2a3f" }} 
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto px-12 md:px-24 py-5 md:py-7 bg-[#0A192F] text-white text-[9px] md:text-[11px] font-bold uppercase tracking-[0.4em] md:tracking-[0.6em] rounded-full shadow-xl transition-all flex items-center justify-center gap-4"
                >
                  {loading ? (
                    <><Loader2 className="animate-spin" size={18} /> ABRIENDO WHATSAPP...</>
                  ) : (
                    "Enviar por WhatsApp"
                  )}
                </motion.button>
              </div>
            </motion.form>
          ) : (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center py-12 md:py-20"
            >
              <CheckCircle2 size={60} className="md:w-20 md:h-20 text-green-500 mb-6" />
              <h3 className="font-serif text-3xl md:text-5xl italic text-[#0A192F] mb-4">Solicitud lista</h3>
              <p className="max-w-md text-zinc-500 uppercase tracking-[0.2em] md:tracking-[0.3em] text-[8px] md:text-[10px] leading-relaxed">
                WhatsApp se abrió con tu mensaje. Envíalo para que el concierge te responda.
              </p>
              {whatsappHref ? (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center justify-center rounded-full bg-[#25D366] px-8 py-4 text-[9px] md:text-[11px] font-bold uppercase tracking-[0.3em] text-white shadow-lg"
                >
                  Continuar en WhatsApp
                </a>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}