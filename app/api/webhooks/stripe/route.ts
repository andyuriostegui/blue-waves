// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Webhook signature inválida:', err.message)
    return NextResponse.json({ error: 'Webhook inválido' }, { status: 400 })
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent

    // Guardar el pago en Supabase
    const { error } = await supabase.from('pagos').insert({
      stripe_payment_id: paymentIntent.id,
      amount: paymentIntent.amount / 100, // convertir de centavos a pesos
      currency: paymentIntent.currency,
      status: 'completado',
      yacht_name: paymentIntent.metadata.yachtName,
      client_name: paymentIntent.metadata.clientName,
      client_email: paymentIntent.metadata.clientEmail,
      created_at: new Date().toISOString(),
    })

    if (error) console.error('Error guardando pago en Supabase:', error)
    else console.log('✅ Pago guardado:', paymentIntent.id)
  }

  if (event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent
    console.log('❌ Pago fallido:', paymentIntent.id)
  }

  return NextResponse.json({ received: true })
}