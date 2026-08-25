import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Yate no encontrado',
  robots: { index: false, follow: false },
}

export default function YachtNotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-white">
      <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-zinc-500">
        404
      </p>
      <h1 className="mt-4 text-4xl font-black uppercase tracking-tight md:text-6xl">
        Yate no encontrado
      </h1>
      <p className="mt-4 max-w-md text-center text-sm text-zinc-400">
        Esta embarcación no está en la flota o el enlace cambió.
      </p>
      <Link
        href="/#fleet"
        className="mt-10 border-2 border-white px-8 py-4 font-mono text-[11px] uppercase tracking-[0.4em] hover:bg-white hover:text-black"
      >
        Ver flota
      </Link>
    </main>
  )
}
