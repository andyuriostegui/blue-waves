export const EXPERIENCIAS_PATH = '/experiencias'
export const EXPERIENCIAS_TITLE = 'Experiencias en yate en Cancún'
export const EXPERIENCIAS_OG_TITLE = 'Experiencias en yate privado en Cancún | Blue Waves'
export const EXPERIENCIAS_DESCRIPTION =
  'Experiencias en yate privado en Cancún: zarpe desde la bahía, Isla Mujeres, mesa a bordo y atardecer en el Caribe. Charter con Blue Waves.'
export const EXPERIENCIAS_OG_IMAGE = '/experiencias/atardecer.jpg'
export const EXPERIENCIAS_HERO_IMAGE = '/experiencias/dron.png'
export const EXPERIENCIAS_CTA_IMAGE = '/experiencias/comida.png'

export type ExperienceMedia = {
  src: string
  type: 'image' | 'video'
  alt: string
}

export const EXPERIENCIAS_HERO_MEDIA: ExperienceMedia = {
  src: EXPERIENCIAS_HERO_IMAGE,
  type: 'image',
  alt: 'Yates de lujo en el Caribe turquesa de Cancún — Blue Waves',
}

export const EXPERIENCIAS_CTA_MEDIA: ExperienceMedia = {
  src: EXPERIENCIAS_CTA_IMAGE,
  type: 'image',
  alt: 'Mesa de lujo a bordo con vista al mar',
}

export type ExperienceChapter = {
  id: string
  index: string
  kicker: string
  title: string
  body: string
  media: ExperienceMedia[]
}

export const EXPERIENCE_CHAPTERS: ExperienceChapter[] = [
  {
    id: 'zarpe',
    index: '01',
    kicker: 'Bahía de Cancún',
    title: 'El zarpe.',
    body: 'Salida privada desde la bahía. El agua cambia de tono mientras el capitán deja la costa atrás y el día queda solo de ustedes.',
    media: [
      {
        src: '/olas.mp4',
        type: 'video',
        alt: 'Olas del Caribe al zarpar desde Cancún',
      },
      {
        src: '/experiencias/shark.jpg',
        type: 'image',
        alt: 'Yate de lujo en el muelle de Puerto Cancún, listo para zarpar',
      },
      {
        src: '/experiencias/IMG-20230306-WA0102.jpg',
        type: 'image',
        alt: 'Yate en marcha por aguas turquesa con invitados en cubierta',
      },
    ],
  },
  {
    id: 'isla-mujeres',
    index: '02',
    kicker: 'Isla Mujeres',
    title: 'Agua turquesa.',
    body: 'La ruta habitual llega a Punta Norte e Isla Mujeres. Tiempo para nadar, caminar la playa y volver cuando el grupo lo pida. El itinerario no es un tour cerrado.',
    media: [
      {
        src: '/experiencias/IMG-20260702-WA0143.jpg',
        type: 'image',
        alt: 'Yate de lujo anclado en agua cristalina frente a Isla Mujeres',
      },
      {
        src: '/details/VIVEdyna1.jpg',
        type: 'image',
        alt: 'Yate Blue Waves en aguas turquesa de Cancún',
      },
      {
        src: '/details/VIVEdyna6.jpg',
        type: 'image',
        alt: 'Camas de sol en proa con vista al mar turquesa de Cancún',
      },
    ],
  },
  {
    id: 'mesa',
    index: '03',
    kicker: 'A bordo',
    title: 'La mesa.',
    body: 'Champagne, fruta tropical, tabla gourmet y lo que pidan. La mesa se arma en cubierta, con el mar como único vecino. Alimentos y bebidas se confirman al cotizar.',
    media: [
      {
        src: '/experiencias/comida.png',
        type: 'image',
        alt: 'Mesa de lujo a bordo con champagne, orquídeas y el Caribe turquesa',
      },
      {
        src: '/experiencias/comida2.jpg',
        type: 'image',
        alt: 'Fruta tropical y champagne con vista a la bahía de Cancún',
      },
      {
        src: '/experiencias/comida4.jpg',
        type: 'image',
        alt: 'Brindis con copas de champagne y el horizonte del Caribe',
      },
      {
        src: '/experiencias/tabla.webp',
        type: 'image',
        alt: 'Tabla de quesos, jamón y frutas a bordo del yate',
      },
      {
        src: '/experiencias/comida5.jpg',
        type: 'image',
        alt: 'Bandeja tropical de frutas con champagne y tequila a bordo',
      },
    ],
  },
  {
    id: 'atardecer',
    index: '04',
    kicker: 'Golden hour',
    title: 'El atardecer.',
    body: 'El charter se queda en bahía para el golden hour. Un brindis, el jacuzzi y Cancún encendiéndose a lo lejos. El momento que más se pide.',
    media: [
      {
        src: '/experiencias/atardecer.jpg',
        type: 'image',
        alt: 'Atardecer privado en yate en Cancún, bandera de México a proa',
      },
      {
        src: '/experiencias/jacuzzi.jpg',
        type: 'image',
        alt: 'Jacuzzi al anochecer con champagne a bordo en Cancún',
      },
      {
        src: '/experiencias/atardecer-caribe.jpg',
        type: 'image',
        alt: 'Sol poniéndose sobre el Caribe desde la cubierta del yate',
      },
    ],
  },
  {
    id: 'toys',
    index: '05',
    kicker: 'Water toys',
    title: 'Más allá del horizonte.',
    body: 'Jet ski, Seabob y lo que se reserve con anticipación. Adrenalina opcional: el día sigue siendo de ustedes, a su ritmo.',
    media: [
      {
        src: '/experiencias/jetski.jpg',
        type: 'image',
        alt: 'Jet ski Sea-Doo al atardecer en el Caribe, charter Blue Waves',
      },
      {
        src: '/experiencias/aquabanas.jpg',
        type: 'image',
        alt: 'Isla flotante AquaBanas al atardecer junto al yate',
      },
      {
        src: '/experiencias/dron.png',
        type: 'image',
        alt: 'Jet ski trazando estela alrededor de yates en agua turquesa',
      },
    ],
  },
]

export const EXPERIENCE_LOOKBOOK: ExperienceMedia[] = [
  {
    src: '/experiencias/dron.png',
    type: 'image',
    alt: 'Yates en el Caribe turquesa de Cancún',
  },
  {
    src: '/experiencias/comida.png',
    type: 'image',
    alt: 'Mesa de lujo a bordo con vista al mar',
  },
  {
    src: '/experiencias/atardecer.jpg',
    type: 'image',
    alt: 'Atardecer en yate privado en Cancún',
  },
  {
    src: '/experiencias/comida2.jpg',
    type: 'image',
    alt: 'Fruta y champagne frente a Cancún',
  },
  {
    src: '/experiencias/jacuzzi.jpg',
    type: 'image',
    alt: 'Jacuzzi al anochecer a bordo',
  },
  {
    src: '/experiencias/tabla.webp',
    type: 'image',
    alt: 'Tabla gourmet a bordo',
  },
  {
    src: '/experiencias/IMG-20260702-WA0143.jpg',
    type: 'image',
    alt: 'Yate anclado en agua cristalina',
  },
  {
    src: '/experiencias/comida4.jpg',
    type: 'image',
    alt: 'Brindis al Caribe',
  },
  {
    src: '/experiencias/comida5.jpg',
    type: 'image',
    alt: 'Fruta tropical y destilados a bordo',
  },
]
