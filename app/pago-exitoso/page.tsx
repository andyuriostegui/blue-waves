// app/pago-exitoso/page.tsx
// Página de confirmación que ve el cliente después de pagar
'use client'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'

export default function PagoExitoso() {
  const searchParams = useSearchParams()
  const yacht = searchParams.get('yacht') || 'tu yate'
  const monto = Number(searchParams.get('monto')) || 0

  return (
    <div className="min-h-screen bg-[#0A192F] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md text-center space-y-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/30"
        >
          <CheckCircle2 size={40} className="text-white" />
        </motion.div>

        <div className="space-y-3">
          <p className="text-[10px] tracking-[0.5em] uppercase text-blue-400 font-bold">Blue Waves Cancún</p>
          <h1 className="font-serif text-4xl italic text-white font-light">¡Pago Exitoso!</h1>
          <p className="text-zinc-400 font-light leading-relaxed">
            Tu reserva de <span className="text-white font-medium">{yacht}</span> ha sido confirmada.
            {monto > 0 && (
              <> Recibimos <span className="text-white font-bold">${monto.toLocaleString('es-MX')} MXN</span> correctamente.</>
            )}
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left space-y-3">
          <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">¿Qué sigue?</p>
          <ul className="text-sm text-zinc-300 space-y-2 font-light">
            <li className="flex items-start gap-2"><span className="text-blue-400 mt-0.5">→</span> Recibirás un correo de confirmación.</li>
            <li className="flex items-start gap-2"><span className="text-blue-400 mt-0.5">→</span> El equipo de Blue Waves se pondrá en contacto contigo para coordinar los detalles.</li>
            <li className="flex items-start gap-2"><span className="text-blue-400 mt-0.5">→</span> ¡Prepárate para una experiencia increíble en el mar!</li>
          </ul>
        </div>

        <a
          href="/"
          className="inline-block border border-white/20 text-zinc-300 px-8 py-3 text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-white/10 transition rounded-lg"
        >
          Volver al inicio
        </a>
      </motion.div>
    </div>
  )
}