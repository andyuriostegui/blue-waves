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
  atenea: {
    description: `The name is on the bow. Atenea is a 53-foot Sea Ray with a flybridge and an open foredeck, ready for a private charter out of Cancún.

The deck keeps the group in the Caribbean sun. Below, 2 cabins and 2 bathrooms give you a place to slow down without leaving the boat.

Highlights:

Sea Ray 53’: a classic profile, with Atenea on the hull.

Flybridge and bow: the day is lived upstairs, facing the water.

Interior: 2 cabins and 2 bathrooms.`,
    features: [
      '53-foot Sea Ray',
      'Flybridge',
      'Bow sundeck',
      '2 cabins',
      '2 bathrooms',
    ],
    includes: [],
  },
  belleza: {
    description: `Belleza lives up to the name. A 60-foot Fairline Squadron: European lines, a flybridge, and one continuous deck from the bow sunpad to the stern.

She takes a group of up to 15. Inside, 2 cabins and 2 bathrooms are the quiet point when the Caribbean sun is high.

Highlights:

Fairline Squadron 60’: real presence in the bay.

Flybridge: the high view over turquoise water.

Up to 15 guests, with 2 cabins and 2 bathrooms.`,
    features: [
      '60-foot Fairline Squadron',
      'Flybridge',
      'Bow sunpad',
      'Full-length deck',
      '2 cabins',
      '2 bathrooms',
      'Up to 15 guests',
    ],
    includes: [],
  },
  calypso: {
    description: `Calypso is an open-deck Sea Ray Sundancer. The bow is for the sun, the bimini covers the helm, and the interior salon slows the day when the group wants shade.

She is the intimate charter: a private day in the Cancún Caribbean, the city on the horizon and the water right off the swim platform.

Highlights:

Sea Ray Sundancer: dark hull and teak deck.

Open bow and a bimini over the helm.

Interior salon for a break.`,
    features: [
      'Sea Ray Sundancer',
      'Bow sundeck',
      'Bimini over the helm',
      'Interior salon',
      'Swim platform',
    ],
    includes: [],
  },
  comaye: {
    description: `Comaye is a 53-foot yacht with a clean sport deck. Bow sunpad, a long run of windows, and a teak swim platform: the white profile reads clearly from the bay.

She is set for a group of up to 15 on a private charter through the Cancún Caribbean.

Highlights:

53 feet: social space without losing the sport line.

Bow and swim platform for the water.

Up to 15 guests.`,
    features: [
      '53 feet',
      'Bow sundeck',
      'Swim platform',
      'Sport deck',
      'Up to 15 guests',
    ],
    includes: [],
  },
  dejavu: {
    description: `Dejavu is a 44-foot Sea Ray. The open bow faces the turquoise and the hardtop covers the helm, flag up and Cancún behind.

She takes a group of up to 15. The right size for a day of sun, a long stop, and a jump in the water.

Highlights:

Sea Ray 44’: a wide bow for the sun.

Hardtop over the helm.

Up to 15 guests.`,
    features: [
      '44-foot Sea Ray',
      'Bow sundeck',
      'Hardtop',
      'Up to 15 guests',
    ],
    includes: [],
  },
  forever: {
    description: `Forever is a 50-foot Prestige. A French sport yacht: continuous side windows, a deck made for being outside, and a line that looks sharp against Cancún blue.

On board: 2 cabins and 2 bathrooms, with room for 15 on a private day.

Highlights:

Prestige 50’: sport design, windows from end to end.

2 cabins and 2 bathrooms.

Up to 15 guests.`,
    features: [
      '50-foot Prestige',
      'Continuous windows',
      'Exterior deck',
      '2 cabins',
      '2 bathrooms',
      'Up to 15 guests',
    ],
    includes: [],
  },
  mia: {
    description: `Mia is an open-bow Chaparral, her name on the black hull, based in Puerto Juárez. Bimini, a social deck, and an outboard: the boat for the mangrove, the bay, and the water close by.

She is not a multi-deck yacht. She is the quick plan, in a group, with the Caribbean one step off the platform.

Highlights:

Chaparral: black hull, Mia in plain sight.

Open bow, bimini, and a social deck.

Departs from Puerto Juárez.`,
    features: [
      'Chaparral',
      'Open bow',
      'Bimini',
      'Social deck',
      'Puerto Juárez',
    ],
    includes: [],
  },
  'miami-mistress': {
    description: `Miami Mistress is a 51-foot Sea Ray flybridge. The upper helm sees the whole horizon; the swim platform drops to the water, with room for the inflatable alongside.

Below: 3 cabins and 2 bathrooms. On deck, a group of up to 17 for a full day toward Isla Mujeres.

Highlights:

51’ Sea Ray flybridge: the view from the bridge.

3 cabins and 2 bathrooms.

Up to 17 guests, with a swim platform.`,
    features: [
      '51-foot Sea Ray',
      'Flybridge',
      '3 cabins',
      '2 bathrooms',
      'Swim platform',
      'Up to 17 guests',
    ],
    includes: [],
  },
  necessity: {
    description: `Necessity I is a 50-foot Sea Ray. Green hull, a bimini flybridge, and the name on the stern. The bridge takes the helm; the swim platform steps straight into the Caribbean.

She is set for groups of up to 17 on a day charter from Cancún.

Highlights:

50’ Sea Ray: flybridge and a green hull.

Necessity on the stern.

Up to 17 guests and a swim platform.`,
    features: [
      '50-foot Sea Ray',
      'Flybridge',
      'Bimini',
      'Swim platform',
      'Up to 17 guests',
    ],
    includes: [],
  },
  atlantido: {
    description: `Atlantido is a 50-foot Fairline Squadron. A white hull with black graphics, a bimini flybridge, and the name in script across the stern.

The bow sunpad faces the Caribbean and the teak platform steps into the water. Inside, a white salon with wood holds 2 cabins and 2 bathrooms, for a group of up to 12.

Highlights:

Fairline Squadron 50’: flybridge and a sport line.

Bow and a teak swim platform.

2 cabins, 2 bathrooms, and up to 12 guests.`,
    features: [
      '50-foot Fairline Squadron',
      'Flybridge',
      'Bow sundeck',
      'Teak platform',
      'Interior salon',
      '2 cabins',
      '2 bathrooms',
      'Up to 12 guests',
    ],
    includes: [],
  },
  beluga: {
    description: `Beluga is a Lagoon 450, a 46-foot sailing catamaran. Two white hulls, sail up, and nets on the bow: the day crosses on the wind, from Cancún into the Caribbean.

The flybridge takes the helm under the bimini, with a sunpad aft. The deck dining table opens onto the salon and the galley. Below: 4 cabins and 2 bathrooms, for a group of up to 15.

Highlights:

Lagoon 450: a sailing catamaran, two hulls.

Flybridge, sunpad, and an aft dining table.

4 cabins, 2 bathrooms, and up to 15 guests.`,
    features: [
      'Lagoon 450',
      'Sailing catamaran',
      'Flybridge',
      'Aft sunpad',
      'Deck dining',
      'Salon and galley',
      '4 cabins',
      '2 bathrooms',
      'Up to 15 guests',
    ],
    includes: [],
  },
  'dolce-far-niente': {
    description: `The name is on the stern, and Montego Bay is written under it. Dolce Far Niente is a 44-foot Sea Ray: teak decks, a bimini over the helm, and a curved salon for the group.

She takes a day of up to 15. Below: 1 cabin and 2 bathrooms, with the galley beside the sofa.

Highlights:

Sea Ray 44’: teak, a bimini, and the name on the stern.

Curved salon and a galley on board.

Up to 15 guests, with 1 cabin and 2 bathrooms.`,
    features: [
      '44-foot Sea Ray',
      'Teak deck',
      'Bimini',
      'Curved salon',
      'Galley',
      '1 cabin',
      '2 bathrooms',
      'Up to 15 guests',
    ],
    includes: [],
  },
  'slice-of-life': {
    description: `Slice of Life carries the name on the transom, with Cancún underneath. She is a white-hardtop Sea Ray Sundancer: a bow sunpad, a teak cockpit, and a swim platform.

The bimini covers the helm and the cockpit seats. Inside, a cabin and a wood galley slow the day down without leaving the boat.

Highlights:

Sea Ray Sundancer: white hardtop and the name on the stern.

Open bow and a cockpit for the group.

Cabin, galley, and a swim platform.`,
    features: [
      'Sea Ray Sundancer',
      'Hardtop',
      'Bow sundeck',
      'Teak cockpit',
      'Cabin',
      'Galley',
      'Swim platform',
    ],
    includes: [],
  },
  'v-v': {
    description: `V&V is a white flybridge motor yacht. A hardtop on the bridge, a bow sunpad, and an aft deck for sitting facing the sea while the Caribbean runs past.

The profile is a large yacht: several decks, a helm with navigation screens, and room for a long day on the water.

Highlights:

Flybridge with a hardtop.

Bow sunpad and aft deck.

Helm with navigation screens.`,
    features: [
      'Flybridge with hardtop',
      'Bow sunpad',
      'Aft deck',
      'Helm with screens',
    ],
    includes: [],
  },
  'island-gypsy': {
    description: `Island Gypsy carries the name in script across the stern. She is a Sea Ray flybridge: a white hull with a navy stripe, a bow sunpad, and teak decks.

The hardtop covers the cockpit and its curved seats. Inside, a cream-leather salon opens onto a wood galley, with a bathroom and shower.

Highlights:

Sea Ray: flybridge, teak, and Island Gypsy on the stern.

Bow sunpad and a cockpit under the hardtop.

Salon, galley, and a bathroom with shower.`,
    features: [
      'Sea Ray',
      'Flybridge',
      'Bow sundeck',
      'Teak deck',
      'Hardtop',
      'Salon',
      'Galley',
      'Bathroom with shower',
      'Swim platform',
    ],
    includes: [],
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
