import Link from 'next/link'
import { getWhatsAppUrl } from '@/lib/site'

export default function PayPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0A192F] px-6 py-20 text-white">
      <div className="max-w-md space-y-6 text-center">
        <p className="text-xs uppercase tracking-[0.35em]">Blue Waves Cancún</p>
        <h1 className="font-serif text-4xl italic">Te atendemos personalmente</h1>
        <p className="text-sm leading-7 text-slate-300">Los pagos en línea no están disponibles. Contacta a nuestro equipo para coordinar tu reserva.</p>
        <a className="inline-block rounded-full bg-white px-7 py-3 text-sm text-[#0A192F]" href={getWhatsAppUrl('Hola Blue Waves, me gustaría coordinar mi reserva con su equipo.')} target="_blank" rel="noopener noreferrer">Contactar por WhatsApp</a>
        <div><Link className="text-sm underline underline-offset-4" href="/">Volver al inicio</Link></div>
      </div>
    </main>
  )
}