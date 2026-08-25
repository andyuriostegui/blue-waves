export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.bluewavescancun.com.mx'
).replace(/\/+$/, '')

export function toAbsoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl
  const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`
  return `${SITE_URL}${path}`
}

export const SITE_NAME = 'Blue Waves Cancún'
export const SITE_PHONE = '+5219993388888'
export const SITE_WHATSAPP_NUMBER = SITE_PHONE.replace(/\D/g, '')
export const SITE_EMAIL = 'concierge@bluewaves.com'
export const SITE_INSTAGRAM = 'https://www.instagram.com/cancunbluewaves/'
export const SITE_FACEBOOK = 'https://www.facebook.com/bluewavescancun'
export const SITE_LOCATION = 'Cancún, Quintana Roo, México'
export const SITE_TITLE = 'Renta de Yates en Cancún | Blue Waves'
export const SITE_OG_TITLE = 'Renta de yates de lujo en Cancún | Blue Waves'

export const SITE_DESCRIPTION =
  'Renta de yates de lujo en Cancún con Blue Waves. Charter privado a Isla Mujeres, tripulación profesional y flota exclusiva. Cotiza tu yate hoy.'

export const SITE_KEYWORDS = [
  'renta de yates en Cancún',
  'renta de yates Cancún',
  'yate privado Cancún',
  'charter de yate Cancún',
  'yate a Isla Mujeres',
  'Blue Waves Cancún',
]

export const DEFAULT_WHATSAPP_MESSAGE =
  'Hola Blue Waves, me gustaría solicitar información sobre la flota de yates.'

export type InquiryPayload = {
  full_name: string
  email?: string
  phone?: string
  service_type?: string
  budget?: string
  notes?: string
  booking_date?: string
}

export function getWhatsAppUrl(message: string): string {
  return `https://wa.me/${SITE_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

function formatInquiryDate(isoDate: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate)
  if (!match) return isoDate

  const date = new Date(
    Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])),
  )

  return date.toLocaleDateString('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

export function buildInquiryWhatsAppMessage(data: InquiryPayload): string {
  const lines = [
    'Hola Blue Waves, quiero solicitar una cotización.',
    '',
    `Nombre: ${data.full_name.trim()}`,
  ]

  if (data.phone?.trim()) lines.push(`Teléfono: ${data.phone.trim()}`)
  if (data.email?.trim()) lines.push(`Email: ${data.email.trim()}`)
  if (data.service_type?.trim()) {
    lines.push(`Embarcación: ${data.service_type.trim()}`)
  }
  if (data.budget?.trim()) lines.push(`Duración: ${data.budget.trim()}`)
  if (data.booking_date?.trim()) {
    lines.push(`Fecha: ${formatInquiryDate(data.booking_date.trim())}`)
  }
  if (data.notes?.trim()) lines.push(`Notas: ${data.notes.trim()}`)

  return lines.join('\n')
}

export function localDateToIso(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
