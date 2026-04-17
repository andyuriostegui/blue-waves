'use client'
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from '@/lib/supabase';
import { Loader2, CheckCircle2, ChevronDown } from 'lucide-react';

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // CORRECCIÓN DE TYPESCRIPT: Definimos explícitamente que es un array de strings
  const [yachtList, setYachtList] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    service_type: 'General Inquiry',
    budget: '$5,000 — $15,000',
    notes: ''
  });

  useEffect(() => {
    const fetchYachtNames = async () => {
      const { data, error } = await supabase
        .from('yachts')
        .select('name')
        .order('name', { ascending: true });
      
      if (!error && data) {
        // Mapeamos los nombres correctamente
        setYachtList(data.map((y: { name: string }) => y.name));
      }
    };
    fetchYachtNames();
  }, []);

  // CORRECCIÓN DE TYPESCRIPT: Definimos los tipos de eventos para el cambio de input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error: supabaseError } = await supabase
        .from('leads')
        .insert([{ 
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          service_type: formData.service_type,
          budget: formData.budget,
          notes: formData.notes,
          status: 'nuevo' 
        }]);

      if (supabaseError) throw supabaseError;

      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 5000);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al enviar la solicitud.");
    } finally {
      setLoading(false);
    }
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
                <input name="full_name" type="text" placeholder="Julianne Moore" required onChange={handleChange} className="bg-transparent outline-none font-serif text-xl md:text-2xl italic text-[#0A192F] placeholder:text-zinc-200" />
              </div>

              <div className="flex flex-col border-b border-zinc-300 pb-2 focus-within:border-[#0A192F] transition-all duration-500">
                <label className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.4em] text-zinc-400 font-bold mb-2 md:mb-3">Email Address</label>
                <input name="email" type="email" placeholder="client@luxury.com" required onChange={handleChange} className="bg-transparent outline-none font-serif text-xl md:text-2xl italic text-[#0A192F] placeholder:text-zinc-200" />
              </div>

              <div className="flex flex-col border-b border-zinc-300 pb-2 focus-within:border-[#0A192F] transition-all duration-500">
                <label className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.4em] text-zinc-400 font-bold mb-2 md:mb-3">Phone Number</label>
                <input name="phone" type="tel" placeholder="+1 (555) 000-0000" onChange={handleChange} className="bg-transparent outline-none font-serif text-xl md:text-2xl italic text-[#0A192F] placeholder:text-zinc-200" />
              </div>

              {/* Selects */}
              <div className="flex flex-col border-b border-zinc-300 pb-2 relative">
                <label className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.4em] text-zinc-400 font-bold mb-2 md:mb-3">Select Vessel</label>
                <select name="service_type" onChange={handleChange} className="bg-transparent outline-none font-serif text-xl md:text-2xl italic text-[#0A192F] appearance-none cursor-pointer pr-10">
                  <option value="General Inquiry">General Inquiry</option>
                  {yachtList.map((yacht) => (
                    <option key={yacht} value={yacht}>{yacht}</option>
                  ))}
                  <option value="Corporate Event">Corporate Event</option>
                </select>
                <ChevronDown className="absolute bottom-3 right-0 w-4 h-4 text-zinc-300 pointer-events-none" />
              </div>

              <div className="flex flex-col border-b border-zinc-300 pb-2 relative">
                <label className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.4em] text-zinc-400 font-bold mb-2 md:mb-3">Experience Budget (Daily)</label>
                <select name="budget" onChange={handleChange} className="bg-transparent outline-none font-serif text-xl md:text-2xl italic text-[#0A192F] appearance-none cursor-pointer pr-10">
                  <option>$5,000 — $15,000</option>
                  <option>$15,000 — $30,000</option>
                  <option>$30,000 — $60,000</option>
                  <option>Unlimited Luxe ($60k+)</option>
                </select>
                <ChevronDown className="absolute bottom-3 right-0 w-4 h-4 text-zinc-300 pointer-events-none" />
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
                    <><Loader2 className="animate-spin" size={18} /> SENDING...</>
                  ) : (
                    "Request Private Invitation"
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
              <h3 className="font-serif text-3xl md:text-5xl italic text-[#0A192F] mb-4">Solicitud Recibida</h3>
              <p className="text-zinc-500 uppercase tracking-[0.2em] md:tracking-[0.3em] text-[8px] md:text-[10px]">Nuestro concierge se pondrá en contacto pronto.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}