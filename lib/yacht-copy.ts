import type { Locale } from '@/lib/i18n/config'
import { getYachtSlug, type Yacht } from '@/lib/yachts'

type YachtCopy = {
  description: string
  features: string[]
  includes: string[]
}

const YACHT_COPY_EN: Record<string, YachtCopy> = {
  'sunseeker-san-remo': {
    description: `An unmatched day in the Caribbean aboard the Sunseeker San Remo (54 ft). This yacht is versatility and design: open decks that join the sun to absolute luxury. Wide sundecks at bow and stern make it the boat for those who want to tan in style and run with real power.

Wi-Fi on board, high-fidelity Bluetooth sound and a climate-controlled cabin with premium finishes keep the day connected and comfortable. Whether you are on the reef with the snorkel gear included or lying on the floating mat, every detail is set for pleasure.

VIP highlights:

Full connectivity: high-speed Wi-Fi to share the moment as it happens.

True comfort: 2 design cabins, 2 full bathrooms and air conditioning throughout.

Play included: floating mat, snorkel gear, a cold courtesy bar and premium service.`,
    features: [
      'High-speed Wi-Fi',
      '2 luxury cabins',
      '2 full bathrooms',
      'Equipped galley',
      'Air-conditioned indoor salon',
      'Outdoor dining',
      'Air conditioning',
      'Hot water',
      'Bow sundeck',
      'Aft sundeck',
      'Premium Bluetooth sound',
    ],
    includes: [
      '24 still waters',
      '24 soft drinks',
      '24 beers',
      '4 bags of ice',
      'Life jackets',
      'Professional snorkel gear',
      'Recreational floating mat',
    ],
  },
  'vive-dyna-craft': {
    description: `The fullest expression of sophistication on the Dyna Craft 80’. Eighty feet of presence — an oasis of entertainment and comfort for those who will not settle. Its signature private hydromassage jacuzzi lets you sit in the bubbles while you run the clearest water in the Caribbean.

The spaces are monumental: wide sundecks on the bow and flybridge, and a fully climate-controlled salon of contemporary design. Three luxury cabins and serious technology (high-speed Wi-Fi and TV) make it the yacht for VIP celebrations or a high-level family escape.

VIP highlights:

Private jacuzzi: the luxury most guests ask for at sea.

Entertainment spaces: outdoor dining, air-conditioned salon and several sun zones.

Connectivity and comfort: internet on board, full air conditioning and hot water in all 3 bathrooms.

Unlimited play: recreational inflatables and full gear for the water.`,
    features: [
      '3 luxury cabins (2 doubles)',
      '3 full bathrooms',
      'Hot water',
      'Central air conditioning',
      'Hydromassage jacuzzi',
      'HD television',
      'Flybridge sundecks',
      'Bow sundecks',
      'Premium outdoor dining',
      'Indoor living salon',
      'Fully equipped galley',
    ],
    includes: [
      '24 still waters',
      '24 soft drinks',
      '24 beers',
      'Unlimited ice (1 bag per hour)',
      'Selected dry snacks',
      'Dedicated professional crew',
      'Fuel',
      'Recreational inflatables',
      'High-speed internet on board',
      'Satellite television',
    ],
  },
  'golden-sun-azimut': {
    description: `Live up to the name and run under Caribbean light aboard GOLDEN SUN. This 58-foot Azimut is the flagship for those who want space and polish, with room for a memorable celebration and a clean split between the party decks and the quiet ones.

Take the breeze on the flybridge or lie on the aft sunpads. Inside, comfort is complete: a climate-controlled salon, a full galley and Wi-Fi on board. The day usually includes a swim stop in the turquoise water off Isla Mujeres, while courtesy service handles snorkel, a cold-cut board and drinks kept properly cold.

VIP highlights:

Extended capacity: room for a large group without crowding.

Flybridge: the best panorama and the social deck upstairs.

Social hub: outdoor table for lunch facing the sea and professional Bluetooth sound.

Gourmet service: cold-cut board, a full courtesy bar and premium amenities.`,
    features: [
      '3 luxury cabins',
      '2 full bathrooms',
      'TV screens',
      'High-speed Wi-Fi',
      'Social flybridge',
      'Professional Bluetooth sound',
      'Air-conditioned indoor salon',
      'Air conditioning',
      'Fully equipped galley',
      'Outdoor salon with service table',
      'Aft sunpads',
    ],
    includes: [
      'Swim stop at Isla Mujeres (weather permitting)',
      'Premium towels',
      'Life jackets',
      'Professional snorkel gear',
      '24 still waters',
      '24 soft drinks',
      '24 beers',
      'Unlimited ice',
      'Gourmet cold-cut board',
    ],
  },
  'sea-ray-mavie': {
    description: `Run with elegance aboard the Sea Ray 45' "Mavie", built for a day of sun, snorkel and quiet luxury. A clean profile and spaces set for comfort make it the yacht for groups who want the Caribbean without a crowd.

Wide bow sundecks catch the horizon; the outdoor dining table holds the breeze. Inside, a climate-controlled salon and equipped galley give you a proper place to rest. Snorkel gear and a cold bar are already on board — a full day on the water, nothing missing.

VIP highlights:

Open living: indoor and outdoor salons designed to be together.

Premium sundeck: the best tan facing Caribbean blue.

A complete day: snorkel gear, towels, a cold courtesy bar and first-rate service.`,
    features: [
      '2 comfortable cabins',
      '2 full bathrooms',
      'Air-conditioned indoor salon',
      'Luxury outdoor dining',
      'Equipped galley',
      'Shaded outdoor salon',
      'Large bow sundecks',
    ],
    includes: [
      '24 still waters',
      '24 soft drinks',
      '24 beers',
      '3 bags of ice',
      'Professional snorkel gear',
      'Premium towels',
    ],
  },
  'sea-ray-seafari': {
    description: `Cast off on the Sea Ray 50' "Seafari". Fifty feet of intelligent social space: the iconic outdoor salon and a massive bow sundeck, the right balance of sun and premium comfort.

Stay in the climate-controlled interior with luxury finishes, or eat facing the sea at the outdoor table. High-power Bluetooth sound and a full galley turn it into a floating residence while you run turquoise water.

VIP highlights:

Two living rooms: indoor and outdoor salons for groups who like to spread out.

Full relax: oversized forward sundecks for the view and the tan.

Cold bar included: courtesy drinks and ice to keep the day cold the whole way.`,
    features: [
      '2 spacious cabins',
      '2 full bathrooms',
      'Air-conditioned indoor salon',
      'Social outdoor salon',
      'Outdoor dining',
      'Equipped galley',
      'Massive bow sundeck',
      'Full air conditioning',
      'High-power Bluetooth sound',
    ],
    includes: [
      '24 still waters',
      '24 soft drinks',
      '24 beers',
      '4 bags of premium ice',
      'Professional crew',
      'Fuel',
    ],
  },
  azimut: {
    description: `The most spectacular yacht in the fleet: the Azimut 95’. Nearly thirty metres — a floating mansion for those who want the full nautical life. Latest-generation stabilizers keep the run smooth even in open water.

The spaces are vast: a formal indoor dining room and two outdoor tables for dinner under the stars. The flybridge has a grill and a private bar; the bow sundecks take the sun. Fine woods, high-speed Wi-Fi and concierge service with welcome fruit and premium snacks. The Azimut 95’ is not just a charter. It is a statement.

VIP highlights:

Superior tech: onboard stabilizers and full Wi-Fi.

Master suites: 3 large luxury cabins with air conditioning and hot water.

Social hub: flybridge with bar and grill, built for private celebrations.

Gourmet ready: equipped galley and several dining areas for a private table at sea.`,
    features: [
      '3 VIP cabins',
      '3 luxury bathrooms',
      'Hot water',
      'Full air conditioning',
      'HD screens',
      'Bow sundecks',
      '2 outdoor dining areas',
      'Formal indoor dining',
      'Luxury indoor salon',
      'Fully equipped galley',
      'Professional grill',
      'Service bar',
      'Premium Bluetooth sound',
      'High-speed Wi-Fi',
      'Navigation stabilizers',
    ],
    includes: [
      '24 still waters',
      '24 soft drinks',
      '24 beers',
      'Unlimited ice (1 bag per hour)',
      'Selected dry snacks',
      'Seasonal welcome fruit',
      'Elite crew',
      'Fuel',
    ],
  },
  'pershing-5x-principe': {
    description: `Adrenaline and prestige on the Pershing 5X (56 ft). A 2019 high-performance Italian yacht: agile without giving up the comfort of a luxury hotel. The sporting profile cuts the swell and arrives looking like a statement.

Impeccable finishes on the bow and stern sundecks; a climate-controlled interior with HD entertainment. Snorkel the reef or sit at the outdoor table with a cold bar — a full sensory day in the Caribbean.

VIP highlights:

Superior performance: fast, stable, unmistakeable.

Dual living: dining and salons indoors and in the sun.

Premium finishes: 2 design cabins, 2 full bathrooms and high-fidelity Bluetooth sound.

Ready to cruise: towels, snorkel, a full drinks bar and snacks for a perfect day.`,
    features: [
      '2 design cabins',
      '2 full bathrooms',
      'Luxury indoor salon',
      'Social outdoor salon',
      '2 independent dining areas',
      'Bow sundeck',
      'Aft sundeck',
      'Central air conditioning',
      'HD television',
      'High-power Bluetooth sound',
    ],
    includes: [
      'Professional snorkel gear',
      'Life jackets',
      'Premium towels',
      'Dry snacks',
      '24 still waters',
      '24 soft drinks',
      '24 beers',
      'Unlimited ice (1 bag per hour)',
    ],
  },
}

export function localizeYacht(yacht: Yacht, locale: Locale): Yacht {
  if (locale !== 'en') return yacht

  const copy = YACHT_COPY_EN[getYachtSlug(yacht)]
  if (!copy) return yacht

  return {
    ...yacht,
    description: copy.description,
    features: copy.features,
    includes: copy.includes,
  }
}

export function localizeYachts(yachts: Yacht[], locale: Locale): Yacht[] {
  if (locale !== 'en') return yachts
  return yachts.map((yacht) => localizeYacht(yacht, locale))
}
