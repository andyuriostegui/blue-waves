import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import ReviewExperience from './ReviewExperience'

const serif = Cormorant_Garamond({ subsets: ['latin'], weight: ['400', '500', '600'], style: ['normal', 'italic'], variable: '--review-serif' })
const sans = Inter({ subsets: ['latin'], variable: '--review-sans' })

export const metadata: Metadata = {
  title: 'Tu experiencia a bordo',
  description: 'Gracias por navegar con Blue Waves. Comparte tu experiencia con nosotros.',
  robots: { index: false, follow: true },
}

export default function OpinionesPage() {
  return <div className={`${serif.variable} ${sans.variable}`}><ReviewExperience /></div>
}
