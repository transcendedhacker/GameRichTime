import { LuxuryItem } from '../types/game';

export const initialLuxuryItems: LuxuryItem[] = [
  {
    id: 'porsche_911',
    name: '911 GT3 RS Weissach',
    category: 'Supercar',
    brand: 'Porsche',
    cost: 320000,
    hourlyMaintenance: 120,
    prestigePoints: 45,
    owned: false,
    topSpeedOrSpecs: '518 HP · 0-60 in 3.0s · Carbon Aero',
    description: 'Track-honed precision tool featuring active DRS rear wing and atmospheric 4.0L flat-six engine.'
  },
  {
    id: 'ferrari_sf90',
    name: 'SF90 Stradale Assetto Fiorano',
    category: 'Supercar',
    brand: 'Ferrari',
    cost: 650000,
    hourlyMaintenance: 280,
    prestigePoints: 95,
    owned: false,
    topSpeedOrSpecs: '986 HP · 0-60 in 2.1s · Tri-Motor Hybrid',
    description: 'Maranello flagship with twin-turbo V8 paired with three electric motors producing immense hypercar acceleration.'
  },
  {
    id: 'rolls_phantom',
    name: 'Phantom Extended Wheelbase',
    category: 'Supercar',
    brand: 'Rolls-Royce',
    cost: 780000,
    hourlyMaintenance: 350,
    prestigePoints: 120,
    owned: false,
    topSpeedOrSpecs: 'V12 Twin-Turbo · Starlight Headliner · Magic Carpet Ride',
    description: 'The pinnacle of chauffeured luxury. Whispering V12 engine and handcrafted lambswool floormats.'
  },
  {
    id: 'bugatti_chiron',
    name: 'Chiron Super Sport 300+',
    category: 'Supercar',
    brand: 'Bugatti',
    cost: 4200000,
    hourlyMaintenance: 1800,
    prestigePoints: 450,
    owned: false,
    topSpeedOrSpecs: '1,577 HP · 304.7 MPH · 8.0L Quad-Turbo W16',
    description: 'An engineering triumph constructed of exposed lacquer carbon fiber capable of breaking the 300 mph sound barrier.'
  },
  {
    id: 'pagani_huayra',
    name: 'Huayra R Arte in Pista',
    category: 'Supercar',
    brand: 'Pagani',
    cost: 5800000,
    hourlyMaintenance: 2500,
    prestigePoints: 620,
    owned: false,
    topSpeedOrSpecs: '850 HP · 9,000 RPM V12 · Carbo-Titanium Monocoque',
    description: 'Sculpted Italian kinetic art with howling naturally aspirated V12 designed by Horacio Pagani.'
  },
  {
    id: 'airbus_heli',
    name: 'ACH145 Line Executive',
    category: 'Aircraft',
    brand: 'Airbus Corporate Helicopters',
    cost: 9500000,
    hourlyMaintenance: 3800,
    prestigePoints: 850,
    owned: false,
    topSpeedOrSpecs: '150 Knots · 400 NM Range · 8 VIP Passengers',
    description: 'Bespoke executive rotorcraft fitted with sound-dampened leather interior, landed atop your skyscraper penthouse.'
  },
  {
    id: 'submersible',
    name: 'Triton 3300/6 Deep Explorer',
    category: 'Superyacht',
    brand: 'Triton Submarines',
    cost: 18000000,
    hourlyMaintenance: 6200,
    prestigePoints: 1400,
    owned: false,
    topSpeedOrSpecs: '3,300 Ft Depth · Optical Acrylic Sphere · 6 Crew',
    description: 'Commercial-grade deep ocean explorer capable of descending into oceanic trenches in absolute comfort.'
  },
  {
    id: 'gulfstream_g700',
    name: 'G700 Flagship Ultra-Long-Range',
    category: 'Aircraft',
    brand: 'Gulfstream Aerospace',
    cost: 78000000,
    hourlyMaintenance: 22000,
    prestigePoints: 4800,
    owned: false,
    topSpeedOrSpecs: 'Mach 0.925 · 7,750 NM Range · 5 Living Zones',
    description: 'Non-stop private intercontinental travel from New York to Tokyo with circadian lighting and master bedroom suite.'
  },
  {
    id: 'superyacht_solandge',
    name: '280-Foot Lurssen Megayacht (Aethelgard)',
    category: 'Superyacht',
    brand: 'Lürssen Yachts',
    cost: 210000000,
    hourlyMaintenance: 75000,
    prestigePoints: 12500,
    owned: false,
    topSpeedOrSpecs: '280 Feet · Certified Helipad · Beach Club & Spa · 22 Guests',
    description: 'A floating sovereign palace with six decks, infinity swimming pool, certified helipad, underwater viewing lounge, and submarine bay.'
  }
];
