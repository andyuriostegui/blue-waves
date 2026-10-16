import fs from 'fs'
import path from 'path'
import type { Yacht } from '@/lib/yachts'

const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp'])

const COVERS: Record<string, string> = {
  ATENEA: 'IMG-20221221-WA0096.jpg',
  ATLANTIDO: 'IMG-20260916-WA0022(1).jpg',
  BELLEZA: 'DJI_0001.jpg',
  BELUGA: 'Catamaran vela 1.jpg',
  CALYPSO: 'DSC_0111 (1).jpg',
  COMAYE: 'IMG-20240619-WA0065 (1).jpg',
  DEJAVU: 'IMAGEN 1 (1).jpeg',
  'DOLCE FAR NIENTE': 'DJI_0693.jpg',
  FOREVER: 'DJI_0067 (1).jpg',
  'ISLAN GYPSI': 'DJI_0227.JPG',
  MAVIE: 'DJI_20250821095209_0284_D (1).jpg',
  MIA: 'IMG-20221203-WA0049 (1).jpg',
  MIAMI: 'Miami Mistress 51 (14).jpg',
  NECESSITY: 'DJI_01010.jpg',
  SEAFARI: 'DJI_0030 (1).JPG',
  'SLICE OF LIFE': 'WhatsApp Image 2026-06-16 at 14.06.24 (1).jpeg',
  'V&V': 'DJI_0524.jpg',
}

type GalleryYacht = {
  folder: string
  match: (name: string) => boolean
  yacht?: Omit<Yacht, 'images'>
}

const GALLERIES: GalleryYacht[] = [
  { folder: 'MAVIE', match: (name) => name.includes('mavie') },
  { folder: 'SEAFARI', match: (name) => name.includes('seafari') },
  {
    folder: 'ATENEA',
    match: (name) => name.includes('atenea'),
    yacht: {
      id: 'gallery-atenea',
      name: 'Atenea',
      slug: 'atenea',
      size: '53Ft',
      capacity: 6,
      cabins: 2,
      bathrooms: 2,
      description: `El nombre va en la proa. Atenea es un Sea Ray de 53 pies con flybridge y asoleadero abierto, listo para un charter privado desde Cancún.

La cubierta junta al grupo bajo el sol del Caribe. Abajo hay 2 camarotes y 2 baños para bajar el ritmo sin dejar el barco.

Highlights:

Sea Ray 53’: perfil clásico, con el nombre Atenea en el casco.

Flybridge y proa: el día se vive arriba, de cara al agua.

Interior: 2 camarotes y 2 baños.`,
      features: [
        'Sea Ray 53 pies',
        'Flybridge',
        'Asoleadero de proa',
        '2 camarotes',
        '2 baños',
      ],
      includes: [],
    },
  },
  {
    folder: 'ATLANTIDO',
    match: (name) => name.includes('atlantido') || name.includes('atlantida'),
    yacht: {
      id: 'gallery-atlantido',
      name: 'Atlantido',
      slug: 'atlantido',
      size: '50Ft',
      capacity: 12,
      cabins: 2,
      bathrooms: 2,
      description: `Atlantido es un Fairline Squadron de 50 pies. Casco blanco con gráfica negra, flybridge con toldo y el nombre en letra corrida sobre la popa.

El asoleadero de proa mira al Caribe y la plataforma de teca baja al agua. Adentro, el salón blanco con madera guarda 2 camarotes y 2 baños, para un grupo de hasta 12.

Highlights:

Fairline Squadron 50’: flybridge y línea sport.

Proa y plataforma de baño de teca.

2 camarotes, 2 baños y hasta 12 huéspedes.`,
      features: [
        'Fairline Squadron 50 pies',
        'Flybridge',
        'Asoleadero de proa',
        'Plataforma de teca',
        'Salón interior',
        '2 camarotes',
        '2 baños',
        'Hasta 12 huéspedes',
      ],
      includes: [],
    },
  },
  {
    folder: 'BELLEZA',
    match: (name) => name.includes('belleza'),
    yacht: {
      id: 'gallery-belleza',
      name: 'Belleza',
      slug: 'belleza',
      size: '60Ft',
      capacity: 15,
      cabins: 2,
      bathrooms: 2,
      description: `Belleza hace honor al nombre. Es un Fairline Squadron de 60 pies: líneas europeas, flybridge y una cubierta corrida del solárium de proa a la popa.

Cabe un grupo de hasta 15. El interior guarda 2 camarotes y 2 baños, el punto de calma cuando el Caribe aprieta el sol.

Highlights:

Fairline Squadron 60’: presencia de verdad en la bahía.

Flybridge: la vista alta sobre el turquesa.

Hasta 15 huéspedes, con 2 camarotes y 2 baños.`,
      features: [
        'Fairline Squadron 60 pies',
        'Flybridge',
        'Solárium de proa',
        'Cubierta corrida',
        '2 camarotes',
        '2 baños',
        'Hasta 15 huéspedes',
      ],
      includes: [],
    },
  },
  {
    folder: 'BELUGA',
    match: (name) => name.includes('beluga'),
    yacht: {
      id: 'gallery-beluga',
      name: 'Beluga',
      slug: 'beluga',
      size: '46Ft',
      capacity: 15,
      cabins: 4,
      bathrooms: 2,
      description: `Beluga es un Lagoon 450, catamarán a vela de 46 pies. Dos cascos blancos, vela arriba y redes de proa: el día se cruza con el viento, de Cancún hacia el Caribe.

El flybridge lleva el timón bajo el toldo, con solárium a popa. El comedor de cubierta da al salón y a la cocina. Abajo hay 4 camarotes y 2 baños, para un grupo de hasta 15.

Highlights:

Lagoon 450: catamarán a vela, dos cascos.

Flybridge, solárium y comedor de popa.

4 camarotes, 2 baños y hasta 15 huéspedes.`,
      features: [
        'Lagoon 450',
        'Catamarán a vela',
        'Flybridge',
        'Solárium de popa',
        'Comedor de cubierta',
        'Salón y cocina',
        '4 camarotes',
        '2 baños',
        'Hasta 15 huéspedes',
      ],
      includes: [],
    },
  },
  {
    folder: 'CALYPSO',
    match: (name) => name.includes('calypso'),
    yacht: {
      id: 'gallery-calypso',
      name: 'Calypso',
      slug: 'calypso',
      size: 'Sundancer',
      description: `Calypso es un Sea Ray Sundancer de cubierta abierta. La proa es para el sol, el toldo cubre el timón y la sala interior baja el ritmo cuando el grupo quiere sombra.

Es el charter íntimo: un día privado en el Caribe de Cancún, con la ciudad en el horizonte y el agua justo al lado de la plataforma.

Highlights:

Sea Ray Sundancer: casco oscuro y cubierta de teca.

Proa abierta y toldo en el timón.

Sala interior para el descanso.`,
      features: [
        'Sea Ray Sundancer',
        'Asoleadero de proa',
        'Toldo en el timón',
        'Sala interior',
        'Plataforma de baño',
      ],
      includes: [],
    },
  },
  {
    folder: 'COMAYE',
    match: (name) => name.includes('comaye'),
    yacht: {
      id: 'gallery-comaye',
      name: 'Comaye',
      slug: 'comaye',
      size: '53Ft',
      capacity: 15,
      description: `Comaye es un yate de 53 pies con una cubierta deportiva y limpia. Asoleadero de proa, ventanales corridos y plataforma de baño de teca: la silueta blanca se reconoce desde la bahía.

Está armado para un grupo de hasta 15 en un charter privado por el Caribe de Cancún.

Highlights:

53 pies: espacio social sin perder la línea sport.

Proa y plataforma de baño para el agua.

Hasta 15 huéspedes.`,
      features: [
        '53 pies',
        'Asoleadero de proa',
        'Plataforma de baño',
        'Cubierta deportiva',
        'Hasta 15 huéspedes',
      ],
      includes: [],
    },
  },
  {
    folder: 'DEJAVU',
    match: (name) => name.includes('dejavu') || name.includes('deja vu'),
    yacht: {
      id: 'gallery-dejavu',
      name: 'Dejavu',
      slug: 'dejavu',
      size: '44Ft',
      capacity: 15,
      description: `Dejavu es un Sea Ray de 44 pies. La proa abierta mira de frente al turquesa y el hardtop cubre el timón, con la bandera arriba y Cancún atrás.

Cabe un grupo de hasta 15. Es el tamaño justo para un día de sol, una parada larga y el salto al agua.

Highlights:

Sea Ray 44’: proa ancha para el sol.

Hardtop sobre el timón.

Hasta 15 huéspedes.`,
      features: [
        'Sea Ray 44 pies',
        'Asoleadero de proa',
        'Hardtop',
        'Hasta 15 huéspedes',
      ],
      includes: [],
    },
  },
  {
    folder: 'DOLCE FAR NIENTE',
    match: (name) => name.includes('dolce'),
    yacht: {
      id: 'gallery-dolce-far-niente',
      name: 'Dolce Far Niente',
      slug: 'dolce-far-niente',
      size: '44Ft',
      capacity: 15,
      cabins: 1,
      bathrooms: 2,
      description: `El nombre va en la popa, y debajo dice Montego Bay. Dolce Far Niente es un Sea Ray de 44 pies: cubierta de teca, toldo sobre el timón y un salón curvo para el grupo.

Cabe un día de hasta 15. Abajo hay 1 camarote y 2 baños, con la cocina al lado del sofá.

Highlights:

Sea Ray 44’: teca, toldo y el nombre en la popa.

Salón curvo y cocina a bordo.

Hasta 15 huéspedes, con 1 camarote y 2 baños.`,
      features: [
        'Sea Ray 44 pies',
        'Cubierta de teca',
        'Toldo',
        'Salón curvo',
        'Cocina',
        '1 camarote',
        '2 baños',
        'Hasta 15 huéspedes',
      ],
      includes: [],
    },
  },
  {
    folder: 'FOREVER',
    match: (name) => name.includes('forever'),
    yacht: {
      id: 'gallery-forever',
      name: 'Forever',
      slug: 'forever',
      size: '50Ft',
      capacity: 15,
      cabins: 2,
      bathrooms: 2,
      description: `Forever es un Prestige de 50 pies. Sport yacht de línea francesa: ventanales corridos, cubierta para estar afuera y una silueta que se ve nueva contra el azul de Cancún.

A bordo hay 2 camarotes y 2 baños, con lugar para 15 en un día privado.

Highlights:

Prestige 50’: diseño sport, ventanales de lado a lado.

2 camarotes y 2 baños.

Hasta 15 huéspedes.`,
      features: [
        'Prestige 50 pies',
        'Ventanales corridos',
        'Cubierta exterior',
        '2 camarotes',
        '2 baños',
        'Hasta 15 huéspedes',
      ],
      includes: [],
    },
  },
  {
    folder: 'ISLAN GYPSI',
    match: (name) =>
      name.includes('island gypsy') ||
      name.includes('island gypsi') ||
      name.includes('islan gypsi'),
    yacht: {
      id: 'gallery-island-gypsy',
      name: 'Island Gypsy',
      slug: 'island-gypsy',
      size: 'Flybridge',
      description: `Island Gypsy lleva el nombre en letra corrida sobre la popa. Es un Sea Ray de flybridge: casco blanco con franja marina, asoleadero de proa y cubierta de teca.

El hardtop cubre la bañera de asientos curvos. Adentro, el salón en piel clara abre a la cocina de madera, con baño y regadera.

Highlights:

Sea Ray: flybridge, teca y el nombre Island Gypsy en la popa.

Asoleadero de proa y bañera bajo el hardtop.

Salón, cocina y baño con regadera.`,
      features: [
        'Sea Ray',
        'Flybridge',
        'Asoleadero de proa',
        'Cubierta de teca',
        'Hardtop',
        'Salón',
        'Cocina',
        'Baño con regadera',
        'Plataforma de baño',
      ],
      includes: [],
    },
  },
  {
    folder: 'MIA',
    match: (name) => /\bmia\b/.test(name),
    yacht: {
      id: 'gallery-mia',
      name: 'Mia',
      slug: 'mia',
      size: 'Chaparral',
      description: `Mia es una Chaparral de proa abierta, con el nombre en el casco negro y base en Puerto Juárez. Toldo, cubierta social y motor fuera de borda: la lancha para quien quiere el manglar, la bahía y el agua cerca.

No es un yate de varios pisos. Es el plan ágil, en grupo, con el Caribe a un paso de la plataforma.

Highlights:

Chaparral: casco negro, nombre Mia a la vista.

Proa abierta, toldo y cubierta social.

Sale de Puerto Juárez.`,
      features: [
        'Chaparral',
        'Proa abierta',
        'Toldo',
        'Cubierta social',
        'Puerto Juárez',
      ],
      includes: [],
    },
  },
  {
    folder: 'MIAMI',
    match: (name) => name.includes('miami'),
    yacht: {
      id: 'gallery-miami',
      name: 'Miami Mistress',
      slug: 'miami-mistress',
      size: '51Ft',
      capacity: 17,
      cabins: 3,
      bathrooms: 2,
      description: `Miami Mistress es un Sea Ray flybridge de 51 pies. El puente alto mira todo el horizonte; la plataforma de baño baja al agua, con espacio para el inflable al lado.

Abajo hay 3 camarotes y 2 baños. En cubierta cabe un grupo de hasta 17 para un día completo hacia Isla Mujeres.

Highlights:

Sea Ray 51’ flybridge: vista desde el puente.

3 camarotes y 2 baños.

Hasta 17 huéspedes, con plataforma de baño.`,
      features: [
        'Sea Ray 51 pies',
        'Flybridge',
        '3 camarotes',
        '2 baños',
        'Plataforma de baño',
        'Hasta 17 huéspedes',
      ],
      includes: [],
    },
  },
  {
    folder: 'NECESSITY',
    match: (name) => name.includes('necessity'),
    yacht: {
      id: 'gallery-necessity',
      name: 'Necessity',
      slug: 'necessity',
      size: '50Ft',
      capacity: 17,
      description: `Necessity I es un Sea Ray de 50 pies. Casco verde, flybridge con toldo y el nombre escrito en la popa. El puente lleva el timón; la plataforma de baño baja directo al Caribe.

Está pensado para grupos de hasta 17 en un charter de día desde Cancún.

Highlights:

Sea Ray 50’: flybridge y casco verde.

Nombre Necessity en la popa.

Hasta 17 huéspedes y plataforma de baño.`,
      features: [
        'Sea Ray 50 pies',
        'Flybridge',
        'Toldo',
        'Plataforma de baño',
        'Hasta 17 huéspedes',
      ],
      includes: [],
    },
  },
  {
    folder: 'SLICE OF LIFE',
    match: (name) => name.includes('slice'),
    yacht: {
      id: 'gallery-slice-of-life',
      name: 'Slice of Life',
      slug: 'slice-of-life',
      size: 'Sundancer',
      description: `Slice of Life lleva el nombre en el espejo de popa, con Cancún debajo. Es un Sea Ray Sundancer de hardtop blanco: asoleadero de proa, bañera de teca y plataforma de baño.

El toldo cubre el timón y los asientos de la bañera. Adentro hay camarote y una cocina de madera para bajar el ritmo sin dejar el barco.

Highlights:

Sea Ray Sundancer: hardtop blanco y el nombre en la popa.

Proa abierta y bañera para el grupo.

Camarote, cocina y plataforma de baño.`,
      features: [
        'Sea Ray Sundancer',
        'Hardtop',
        'Asoleadero de proa',
        'Bañera de teca',
        'Camarote',
        'Cocina',
        'Plataforma de baño',
      ],
      includes: [],
    },
  },
  {
    folder: 'V&V',
    match: (name) => name.includes('v&v') || name.includes('v v'),
    yacht: {
      id: 'gallery-v-and-v',
      name: 'V&V',
      slug: 'v-v',
      size: 'Flybridge',
      description: `V&V es un motor yacht blanco de flybridge. Hardtop en el puente, solárium de proa y una cubierta de popa para estar frente al mar mientras corre el Caribe.

La silueta es de un yate grande: varias cubiertas, timón con pantallas de navegación y espacio para un día largo en el agua.

Highlights:

Flybridge con hardtop.

Solárium de proa y cubierta de popa.

Puente con pantallas de navegación.`,
      features: [
        'Flybridge con hardtop',
        'Solárium de proa',
        'Cubierta de popa',
        'Timón con pantallas',
      ],
      includes: [],
    },
  },
]

function normalizeName(name: string) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9&]+/g, ' ')
    .trim()
}

function publicSrc(folder: string, file: string) {
  return `/${folder}/${file}`
}

function listFolderImages(folder: string): string[] {
  const dir = path.join(process.cwd(), 'public', folder)
  let files: string[] = []
  try {
    files = fs.readdirSync(dir)
  } catch {
    return []
  }

  const images = files.filter((file) => {
    if (/copia/i.test(file)) return false
    if (folder === 'ISLAN GYPSI' && file.toLowerCase() === 'dji_0276.jpg') return false
    return IMAGE_EXT.has(path.extname(file).toLowerCase())
  })

  const cover = COVERS[folder]
  const rank = (file: string) => {
    if (cover && file === cover) return 0
    if (/^DJI/i.test(file)) return 1
    if (/^DSC/i.test(file)) return 2
    return 3
  }

  images.sort((a, b) => rank(a) - rank(b) || a.localeCompare(b, 'es'))
  return images.map((file) => publicSrc(folder, file))
}

export function applyFleetGallery(yachts: Yacht[]): Yacht[] {
  const used = new Set<string>()

  const withPhotos = yachts.map((yacht) => {
    const name = normalizeName(yacht.name)
    const gallery = GALLERIES.find((item) => item.match(name))
    if (!gallery) return yacht

    const images = listFolderImages(gallery.folder)
    if (images.length === 0) return yacht

    used.add(gallery.folder)
    return { ...yacht, images }
  })

  const added = GALLERIES.flatMap((gallery) => {
    if (!gallery.yacht || used.has(gallery.folder)) return []
    const images = listFolderImages(gallery.folder)
    if (images.length === 0) return []
    used.add(gallery.folder)
    return [{ ...gallery.yacht, images }]
  })

  return [...withPhotos, ...added]
}
