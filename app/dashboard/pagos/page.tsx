import Link from 'next/link'

export default function PagosPage() {
  return (
    <section className="mx-auto max-w-2xl space-y-4 p-8">
      <h1 className="text-2xl font-semibold">Pagos en línea desactivados</h1>
      <p>Blue Waves todavía no utiliza cobros desde la web. La generación de enlaces de pago está deshabilitada.</p>
      <Link className="inline-block underline underline-offset-4" href="/dashboard">Volver al panel</Link>
    </section>
  )
}