// app/api/create-payment/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

export async function POST(req: NextRequest) {
  try {
    const { amount, yachtName, clientName, clientEmail } = await req.json()

    if (!amount || amount < 10) {
      return NextResponse.json({ error: 'Monto inválido' }, { status: 400 })
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'mxn',
      payment_method_types: ['card'],
      metadata: {
        yachtName: yachtName || 'Sin especificar',
        clientName: clientName || 'Sin especificar',
        clientEmail: clientEmail || '',
      },
      description: `Reserva de yate: ${yachtName} — ${clientName}`,
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error: any) {
    console.error('Error creando PaymentIntent:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}