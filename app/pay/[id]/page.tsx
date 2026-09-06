// app/pay/[id]/page.tsx
// Página pública que ve el cliente cuando recibe el link de pago
'use client'
import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import CheckoutForm from '@/components/CheckoutForm'
import { Loader2 } from 'lucide-react'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function PayPage() {
  const searchParams = useSearchParams()
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Parámetros que vienen en el link generado por el dueño
  const amount = Number(searchParams.get('amount')) || 0
  const yachtName = searchParams.get('yacht') || 'Blue Waves Cancún'
  const clientName = searchParams.get('client') || 'Cliente'
  const clientEmail = searchParams.get('email') || ''

  useEffect(() => {
    if (!amount) return

    fetch('/api/create-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, yachtName, clientName, clientEmail }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) setError(data.error)
        else setClientSecret(data.clientSecret)
      })
      .catch(() => setError('Error al conectar con el servidor de pagos.'))
  }, [amount])

  if (!amount) {
    return (
      <div className="min-h-screen bg-[#0A192F] flex items-center justify-center text-white">
        <p className="font-serif italic text-xl">Link de pago inválido.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A192F] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-[10px] tracking-[0.5em] uppercase text-blue-400 font-bold mb-2">Blue Waves Cancún</p>
          <h1 className="font-serif text-3xl italic text-white font-light">Reserva tu Experiencia</h1>
        </div>

        {/* Card de pago */}
        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          {error ? (
            <div className="text-center text-red-600 space-y-2">
              <p className="font-semibold">Error al cargar el pago</p>
              <p className="text-sm text-zinc-500">{error}</p>
            </div>
          ) : !clientSecret ? (
            <div className="flex flex-col items-center gap-4 py-8">
              <Loader2 className="animate-spin text-blue-600" size={32} />
              <p className="text-sm text-zinc-500 font-serif italic">Preparando tu pago...</p>
            </div>
          ) : (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: 'stripe',
                  variables: {
                    colorPrimary: '#0A192F',
                    colorBackground: '#ffffff',
                    borderRadius: '8px',
                    fontFamily: 'system-ui, sans-serif',
                  },
                },
              }}
            >
              <CheckoutForm
                amount={amount}
                yachtName={yachtName}
                clientName={clientName}
              />
            </Elements>
          )}
        </div>

        <p className="text-center text-zinc-500 text-[10px] mt-6 tracking-wider">
          © {new Date().getFullYear()} Blue Waves Cancún. Todos los derechos reservados.
        </p>
      </div>
    </div>
  )
}