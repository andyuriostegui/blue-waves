'use client'
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, ArrowRight, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  // 1. CHECK DE SESIÓN: Si ya tiene llave, que pase al Dashboard
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) router.push('/dashboard');
    };
    checkSession();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });

      if (error) throw error;

      if (data.user) {
        router.push('/dashboard');
        router.refresh(); // Refresca para que los layouts detecten al usuario
      }
    } catch (error: any) {
      // Manejo de errores amigable
      setErrorMessage(error.message === 'Invalid login credentials' 
        ? 'Credenciales incorrectas. Checa el radar.' 
        : error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#00AEEF] flex items-center justify-center overflow-hidden font-sans">
      
      {/* --- OLAS ANIMADAS --- */}
      <div className="absolute bottom-0 w-full leading-[0]">
        <motion.svg 
          animate={{ x: [-1000, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="relative block w-[200%] h-[150px] md:h-[300px]" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
        >
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5,73.84-4.36,147.54,16.88,218.2,35.26,69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113,2,1200,30.64V0Z" fill="#31C4F3" opacity=".5"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.94,9.41,104.73,20.15,89.23,28.35,189.19,25.92,277.61-2.39,35.25-11.28,68-24.3,108.89-20.13C1024.62,5.81,1121.71,30.18,1200,15.81V0Z" fill="#57D1F7" opacity=".3"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="#FFFFFF"></path>
        </motion.svg>
      </div>

      {/* --- TARJETA DE LOGIN --- */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-[95%] max-w-[850px] min-h-[500px] bg-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex flex-col items-center justify-center p-8 md:p-12"
      >
        {/* Logo */}
        <div className="w-14 h-14 bg-[#00AEEF] rounded-lg flex items-center justify-center mb-4 shadow-lg shadow-cyan-200">
          <div className="text-white font-bold text-2xl">BW</div>
        </div>

        <h2 className="text-[#999] text-lg font-light mb-8 tracking-widest uppercase">Member Login</h2>

        {/* FEEDBACK DE ERROR */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-sm bg-red-50 border-l-4 border-red-500 p-3 mb-6 flex items-center gap-3 text-red-700 text-sm"
            >
              <AlertCircle size={18} />
              {errorMessage}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-6">
          <div className="relative border-b border-gray-100 py-3 transition-all focus-within:border-[#00AEEF]">
            <User className="absolute left-0 top-4 text-[#00AEEF] w-5 h-5 opacity-70" />
            <input 
              type="email" 
              placeholder="Email Address"
              className="w-full pl-10 bg-transparent outline-none text-gray-600 placeholder:text-gray-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative border-b border-gray-100 py-3 transition-all focus-within:border-[#00AEEF]">
            <Lock className="absolute left-0 top-4 text-[#00AEEF] w-5 h-5 opacity-70" />
            <input 
              type="password" 
              placeholder="Password"
              className="w-full pl-10 bg-transparent outline-none text-gray-600 placeholder:text-gray-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#4DD0E1] hover:bg-[#26C6DA] text-white py-4 rounded-md shadow-lg shadow-cyan-100 flex items-center justify-center gap-3 mt-10 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          <div className="flex justify-between items-center mt-8">
             <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
                <input type="checkbox" className="accent-[#4DD0E1]" /> Remember me
             </label>
             <p className="text-gray-400 text-xs cursor-pointer hover:text-[#00AEEF] transition-colors">
              Forgot Password?
            </p>
          </div>
        </form>

        {/* Decoración inferior */}
        <div className="absolute bottom-6 flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === 1 ? 'bg-[#00AEEF]' : 'bg-gray-100'}`} />
            ))}
        </div>
      </motion.div>
    </div>
  );
}