// components/CheckoutForm.tsx
'use client'
import { useState } from 'react'
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Loader2 } from 'lucide-react'

interface CheckoutFormProps {
  amount: number
  yachtName: string
  clientName: string
}

export default function CheckoutForm({ amount, yachtName, clientName }: CheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setIsLoading(true)
    setErrorMessage(null)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/pago-exitoso?yacht=${encodeURIComponent(yachtName)}&monto=${amount}`,
      },
    })

    if (error) {
      setErrorMessage(error.message || 'Ocurrió un error al procesar el pago.')
    }

    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Resumen */}
      <div className="bg-[#0A192F]/5 border border-[#0A192F]/10 rounded-lg p-4 space-y-1">
        <p className="text-xs uppercase tracking-widest text-zinc-400 font-bold">Resumen de reserva</p>
        <p className="text-lg font-serif text-[#0A192F]">{yachtName}</p>
        <p className="text-sm text-zinc-500">{clientName}</p>
        <p className="text-2xl font-bold text-[#0A192F] mt-2">
          ${amount.toLocaleString('es-MX')} <span className="text-sm font-normal text-zinc-400">MXN</span>
        </p>
      </div>

      {/* Formulario de Stripe */}
      <PaymentElement
        options={{
          layout: 'tabs',
          paymentMethodOrder: ['card', 'paypal'],
        }}
      />

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full bg-[#0A192F] text-white py-4 text-[11px] font-bold tracking-[0.3em] uppercase hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" size={16} />
            Procesando...
          </>
        ) : (
          `Pagar $${amount.toLocaleString('es-MX')} MXN`
        )}
      </button>

      <p className="text-center text-[10px] text-zinc-400 tracking-wider">
        Pago seguro procesado por Stripe • SSL Encriptado
      </p>
    </form>
  )
}