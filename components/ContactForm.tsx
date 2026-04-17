'use client'
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from '@/lib/supabase';
import { Loader2, CheckCircle2, ChevronDown } from 'lucide-react';

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [yachtList, setYachtList] = useState<string[]>([]); // Estado para los nombres de yates

  // 1. Estado para capturar los datos
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    service_type: 'Private Charter', // Aquí se guardará el nombre del yate seleccionado
    budget: '$5,000 — $15,000',
    notes: ''
  });

  // 2. Cargar los nombres de los yates desde Supabase al iniciar
  useEffect(() => {
    const fetchYachtNames = async () => {
      const { data, error } = await supabase
        .from('yachts')
        .select('name')
        .order('name', { ascending: true });
      
      if (!error && data) {
        setYachtList(data.map(y => y.name));
      }
    };
    fetchYachtNames();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // GUARDAR EN SUPABASE (Leads)
      const { error: supabaseError } = await supabase
        .from('leads')
        .insert([
          { 
            full_name: formData.full_name,
            email: formData.email,
            phone: formData.phone,
            service_type: formData.service_type,
            budget: formData.budget,
            notes: formData.notes,
            status: 'nuevo'
          }
        ]);

      if (supabaseError) throw supabaseError;

      // ENVIAR EMAIL
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
      alert("Error al enviar la solicitud. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-32 px-6 bg-[#F9FAFB] relative overflow-hidden">
      
      {/* TEXTO DECORATIVO */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03] select-none">
        <h2 className="text-[30vw] font-serif italic text-[#0A192F] leading-none">Inquiry</h2>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-24">
          <span className="text-[9px] tracking-[0.8em] uppercase text-zinc-400 font-bold mb-4 block">Concierge</span>
          <h2 className="font-serif text-7xl italic text-[#0A192F]">Start Your Journey</h2>
        </div>

        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.form 
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onSubmit={handleSubmit} 
              className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-16"
            >
              <div className="flex flex-col border-b border-zinc-300 pb-3 focus-within:border-[#0A192F] transition-all duration-500">
                <label className="text-[10px] uppercase tracking-[0.4em] text-zinc-400 font-bold mb-3">Full Name</label>
                <input 
                  name="full_name"
                  type="text" 
                  placeholder="Julianne Moore" 
                  required
                  onChange={handleChange}
                  className="bg-transparent outline-none font-serif text-2xl italic text-[#0A192F] placeholder:text-zinc-200" 
                />
              </div>

              <div className="flex flex-col border-b border-zinc-300 pb-3 focus-within:border-[#0A192F] transition-all duration-500">
                <label className="text-[10px] uppercase tracking-[0.4em] text-zinc-400 font-bold mb-3">Email Address</label>
                <input 
                  name="email"
                  type="email" 
                  placeholder="client@luxury.com" 
                  required
                  onChange={handleChange}
                  className="bg-transparent outline-none font-serif text-2xl italic text-[#0A192F] placeholder:text-zinc-200" 
                />
              </div>

              <div className="flex flex-col border-b border-zinc-300 pb-3 focus-within:border-[#0A192F] transition-all duration-500">
                <label className="text-[10px] uppercase tracking-[0.4em] text-zinc-400 font-bold mb-3">Phone Number</label>
                <input 
                  name="phone"
                  type="tel" 
                  placeholder="+1 (555) 000-0000" 
                  onChange={handleChange}
                  className="bg-transparent outline-none font-serif text-2xl italic text-[#0A192F] placeholder:text-zinc-200" 
                />
              </div>

              {/* SELECT DINÁMICO DE YATES */}
              <div className="flex flex-col border-b border-zinc-300 pb-3 relative">
                <label className="text-[10px] uppercase tracking-[0.4em] text-zinc-400 font-bold mb-3">Select Vessel</label>
                <select 
                  name="service_type"
                  onChange={handleChange}
                  className="bg-transparent outline-none font-serif text-2xl italic text-[#0A192F] appearance-none cursor-pointer pr-10"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  {yachtList.map((yacht) => (
                    <option key={yacht} value={yacht}>{yacht}</option>
                  ))}
                  <option value="Corporate Event">Corporate Event</option>
                </select>
                <ChevronDown className="absolute bottom-4 right-0 w-4 h-4 text-zinc-300 pointer-events-none" />
              </div>

              <div className="flex flex-col border-b border-zinc-300 pb-3 relative">
                <label className="text-[10px] uppercase tracking-[0.4em] text-zinc-400 font-bold mb-3">Experience Budget (Daily)</label>
                <select 
                  name="budget"
                  onChange={handleChange}
                  className="bg-transparent outline-none font-serif text-2xl italic text-[#0A192F] appearance-none cursor-pointer pr-10"
                >
                  <option>$5,000 — $15,000</option>
                  <option>$15,000 — $30,000</option>
                  <option>$30,000 — $60,000</option>
                  <option>Unlimited Luxe ($60k+)</option>
                </select>
                <ChevronDown className="absolute bottom-4 right-0 w-4 h-4 text-zinc-300 pointer-events-none" />
              </div>

              <div className="md:col-span-2 flex flex-col border-b border-zinc-300 pb-3 focus-within:border-[#0A192F] transition-all duration-500">
                <label className="text-[10px] uppercase tracking-[0.4em] text-zinc-400 font-bold mb-3">Special Notes & Requirements</label>
                <textarea 
                  name="notes"
                  rows={1} 
                  placeholder="Dietary preferences, private aviation, security, etc." 
                  onChange={handleChange}
                  className="bg-transparent outline-none font-serif text-2xl italic text-[#0A192F] placeholder:text-zinc-200 resize-none" 
                />
              </div>

              <div className="md:col-span-2 flex justify-center mt-16">
                <motion.button 
                  whileHover={{ scale: 1.05, backgroundColor: "#1a2a3f" }} 
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={loading}
                  className="px-24 py-7 bg-[#0A192F] text-white text-[11px] font-bold uppercase tracking-[0.6em] rounded-full shadow-[0_20px_50px_rgba(10,25,47,0.3)] transition-all flex items-center gap-4"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Sending...
                    </>
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
              className="flex flex-col items-center text-center py-20"
            >
              <CheckCircle2 size={80} className="text-green-500 mb-6" />
              <h3 className="font-serif text-5xl italic text-[#0A192F] mb-4">Solicitud Recibida</h3>
              <p className="text-zinc-500 uppercase tracking-[0.3em] text-[10px]">Nuestro concierge se pondrá en contacto pronto.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}