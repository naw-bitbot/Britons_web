
import React from 'react';
import { Truck, Globe, Box, Warehouse, Shield, Clock, CheckCircle, Ship } from 'lucide-react';
import { FAQItem, Testimonial } from './types';

export const COMPANY_INFO = {
  name: "Britons Removals & Storage",
  phone: "01332 208 008",
  email: "britons@me.com",
  address: "Unit 4, Little Chester Park, Alfreton Rd, Derby DE21 4AA, United Kingdom",
  website: "britonsremovals.com",
  spainExpertise: "Established European removals specialists handling household moves to and from Spain, France, Germany, Italy and destinations across Europe."
};

// All volumes are now defined in Cubic Meters (m3)
export const INVENTORY_CATEGORIES = [
  {
    id: 'armchairs',
    label: 'Armchairs & Sofas',
    items: [
      { id: 'a1', label: 'Armchair (Standard)', volume: 0.6 },
      { id: 'a2', label: 'Armchair (Large)', volume: 0.8 },
      { id: 'a3', label: '2-Seater Sofa', volume: 1.2 },
      { id: 'a4', label: '3-Seater Sofa', volume: 1.6 },
      { id: 'a5', label: 'Corner Sofa Section', volume: 1.8 },
      { id: 'a6', label: 'Footstool/Pouffe', volume: 0.2 },
    ]
  },
  {
    id: 'beds',
    label: 'Beds & Mattresses',
    items: [
      { id: 'b1', label: 'Single Bed Frame', volume: 1.0 },
      { id: 'b2', label: 'Single Mattress', volume: 0.4 },
      { id: 'b3', label: 'Double Mattress', volume: 0.7 },
      { id: 'b4', label: 'Double Bed Frame', volume: 1.5 },
      { id: 'b5', label: 'King Mattress', volume: 0.9 },
      { id: 'b6', label: 'King Bed Frame', volume: 1.8 },
      { id: 'b7', label: 'Bunk Bed Set', volume: 1.6 },
      { id: 'b8', label: 'Divan Base', volume: 1.2 },
    ]
  },
  {
    id: 'cartons',
    label: 'Boxes & Cartons',
    items: [
      { id: 'c1', label: 'Standard Move Box', volume: 0.1 },
      { id: 'c2', label: 'Small/Book Box', volume: 0.05 },
      { id: 'c3', label: 'Large/Tea Chest', volume: 0.15 },
      { id: 'c4', label: 'Plastic Crate', volume: 0.08 },
      { id: 'c5', label: 'Wardrobe Carton', volume: 0.3 },
      { id: 'c6', label: 'Picture/Mirror Box', volume: 0.1 },
      { id: 'c7', label: 'Bike Box', volume: 0.4 },
    ]
  },
  {
    id: 'furniture',
    label: 'Main Furniture',
    items: [
      { id: 'j1', label: 'Small Sideboard', volume: 0.5 },
      { id: 'j2', label: 'Large Sideboard', volume: 1.2 },
      { id: 'j3', label: 'Coffee Table', volume: 0.3 },
      { id: 'j4', label: 'Display Cabinet', volume: 1.5 },
      { id: 'j5', label: 'Nest of Tables', volume: 0.2 },
      { id: 'j6', label: 'Wall Unit (Large)', volume: 2.0 },
      { id: 'j7', label: 'Bookcase (Small)', volume: 0.6 },
      { id: 'j8', label: 'Bookcase (Large)', volume: 1.5 },
      { id: 'j9', label: 'TV Stand', volume: 0.3 },
    ]
  },
  {
    id: 'electrical',
    label: 'Kitchen Electrical',
    items: [
      { id: 'f1', label: 'Microwave', volume: 0.1 },
      { id: 'f2', label: 'Toaster/Kettle', volume: 0.05 },
      { id: 'f3', label: 'Washing Machine', volume: 0.6 },
      { id: 'f4', label: 'Tumble Dryer', volume: 0.6 },
      { id: 'f5', label: 'Dishwasher', volume: 0.6 },
      { id: 'f6', label: 'Under-counter Fridge', volume: 0.6 },
      { id: 'f7', label: 'Fridge Freezer (Tall)', volume: 1.0 },
      { id: 'f18', label: 'American Fridge Freezer', volume: 1.8 },
    ]
  },
  {
    id: 'drawers',
    label: 'Drawers & Wardrobes',
    items: [
      { id: 'p1', label: 'Single Wardrobe', volume: 1.2 },
      { id: 'p2', label: 'Bedside Table', volume: 0.2 },
      { id: 'p3', label: 'Double Wardrobe', volume: 2.2 },
      { id: 'p5', label: 'Triple Wardrobe', volume: 3.0 },
      { id: 'p7', label: 'Large Chest of Drawers', volume: 0.8 },
      { id: 'p8', label: 'Small Chest of Drawers', volume: 0.4 },
    ]
  },
  {
    id: 'vehicles',
    label: 'Vehicles',
    items: [
      { id: 'v1', label: 'Small Car (e.g. Mini)', volume: 8.0 },
      { id: 'v2', label: 'Medium Car (Saloon)', volume: 12.0 },
      { id: 'v3', label: 'Large SUV / 4x4', volume: 16.0 },
      { id: 'v4', label: 'Motorcycle (Large)', volume: 1.5 },
      { id: 'v5', label: 'Scooter / Moped', volume: 1.0 },
    ]
  },
  {
    id: 'unique',
    label: 'Specialist & Unique',
    items: [
      { id: 'u1', label: 'Upright Piano', volume: 1.8 },
      { id: 'u2', label: 'Baby Grand Piano', volume: 4.5 },
      { id: 'u3', label: 'Grandfather Clock', volume: 0.8 },
      { id: 'u4', label: 'Pool/Snooker Table', volume: 2.5 },
      { id: 'u5', label: 'Large Safe', volume: 1.0 },
      { id: 'u6', label: 'Antique Sideboard', volume: 1.8 },
    ]
  },
  {
    id: 'garden',
    label: 'Garden & Outdoors',
    items: [
      { id: 'i1', label: 'Garden Table', volume: 0.8 },
      { id: 'i2', label: 'Garden Chair', volume: 0.2 },
      { id: 'i5', label: 'Lawnmower', volume: 0.5 },
      { id: 'i6', label: 'Wheelbarrow', volume: 0.6 },
      { id: 'i9', label: 'Garden Shed (Dismantled)', volume: 2.0 },
      { id: 'i10', label: 'BBQ', volume: 0.8 },
    ]
  },
  {
    id: 'electronics',
    label: 'Home Electronics',
    items: [
      { id: 'g1', label: 'TV (Small)', volume: 0.1 },
      { id: 'g2', label: 'TV (Large)', volume: 0.3 },
      { id: 'g10', label: 'Hi-Fi System', volume: 0.1 },
      { id: 'g15', label: 'Large Speakers (Pair)', volume: 0.4 },
      { id: 'g11', label: 'Desktop PC', volume: 0.2 },
    ]
  },
  {
    id: 'garage',
    label: 'Garage & Tools',
    items: [
      { id: 'h1', label: 'Tool Chest', volume: 0.3 },
      { id: 'h3', label: 'Bicycle', volume: 0.4 },
      { id: 'h4', label: 'Work Bench', volume: 0.8 },
      { id: 'h6', label: 'Step Ladder', volume: 0.2 },
    ]
  }
];

export const CALCULATOR_OPTIONS = {
  pricePerM3: 225, // Base rate per cubic meter for international transit (approx £6.50/cuft)
  minVolume: 1.5, // Minimum volume for a quote in m3
  propertySizes: [
    { id: '1bed', label: '1 Bed Flat/House', basePrice: 1400, estVolume: 7 },
    { id: '2bed', label: '2 Bed House', basePrice: 2400, estVolume: 14 },
    { id: '3bed', label: '3 Bed House', basePrice: 3800, estVolume: 23 },
    { id: '4bed', label: '4+ Bed House', basePrice: 5200, estVolume: 35 },
  ],
  ukRegions: [
    { id: 'midlands', label: 'Midlands & North', offset: 0 },
    { id: 'london', label: 'London & South East', offset: 150 },
    { id: 'scotland', label: 'Scotland & Wales', offset: 350 },
  ],
  spainRegions: [
    { id: 'alicante', label: 'Costa Blanca (Alicante/Murcia)', offset: 0 },
    { id: 'malaga', label: 'Costa del Sol (Malaga/Marbella)', offset: 250 },
    { id: 'madrid', label: 'Madrid & Central Spain', offset: 100 },
    { id: 'north', label: 'Northern Spain (Bilbao/Barcelona)', offset: -100 },
  ],
  services: [
    { id: 'packing', label: 'Pro Packing Service', pricePerM3: 50 },
    { id: 'storage', label: '1 Month Storage', price: 180 },
    { id: 'insurance', label: 'Premium Insurance', price: 120 },
  ]
};

export const DETAILED_SERVICES = [
  {
    id: 'full-house',
    icon: <Globe className="w-10 h-10 text-blue-600" />,
    title: "Full Household Removals",
    description: "A premium door-to-door service for complete household moves between the UK and Europe, planned carefully and delivered by experienced removals crews.",
    advantages: [
      "Dedicated space for larger household removals",
      "Loading planned around access, timing and property requirements",
      "Clear delivery scheduling and route coordination",
      "Support with customs and move documentation where required"
    ],
    process: "We begin with a survey or detailed quote review, build a move plan around your volume and destination, prepare the paperwork, load securely, and deliver to your new home with the same care at the other end."
  },
  {
    id: 'part-loads',
    icon: <Truck className="w-10 h-10 text-blue-600" />,
    title: "Part Loads & Smaller Moves",
    description: "A practical premium option for smaller household consignments, holiday-home contents or selected furniture when you do not need a full vehicle.",
    advantages: [
      "Cost-efficient for smaller move volumes",
      "Regular European routes for efficient scheduling",
      "Professional handling, inventory control and transit planning",
      "Ideal for Spain, France, Germany, Italy and wider European destinations"
    ],
    process: "We assess the volume, assign the right route, protect and label the goods properly, and keep the move coordinated from collection through to delivery."
  },
  {
    id: 'packing',
    icon: <Box className="w-10 h-10 text-blue-600" />,
    title: "Packing for European Transit",
    description: "Long-distance removals need more than standard house-moving packing, so we prepare furniture, cartons and fragile items for secure international transport.",
    advantages: [
      "Export wrapping for furniture and delicate items",
      "Strong cartons and professional protective materials",
      "Safer handling for antiques, artwork and breakables",
      "Optional unpacking support at destination"
    ],
    process: "Our team packs room by room, wraps vulnerable items properly, labels cartons clearly, and prepares your belongings for secure transport and, where needed, customs inspection."
  },
  {
    id: 'storage',
    icon: <Warehouse className="w-10 h-10 text-blue-600" />,
    title: "Storage Between Moves",
    description: "Secure storage for customers whose moving dates do not align perfectly, whether you need flexibility for completion delays, phased relocation or later delivery.",
    advantages: [
      "Short-term and longer-term storage options",
      "Secure handling from collection into storage and back out again",
      "Suitable for UK departures and European arrivals",
      "Keeps your move flexible when dates change"
    ],
    process: "We collect, protect and inventory the goods, place them into secure storage, and redeliver when you are ready to complete the move."
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Mark & Helen, Derby to Alicante",
    text: "Britons moved our full house from Derbyshire to the Costa Blanca. What stood out was how organised the crew was from the first call to delivery. The paperwork was explained clearly, the loading was efficient, and everything arrived exactly as expected.",
    rating: 5
  },
  {
    id: 2,
    name: "Rachel P., Kent to Dordogne",
    text: "We were moving a family home to France and needed a company that understood the practical side, not just the sales talk. The packing was excellent, communication was straightforward, and the whole move felt under control.",
    rating: 5
  },
  {
    id: 3,
    name: "Daniel & Emma, Manchester to Munich",
    text: "Our move to Germany included awkward furniture, fragile items and a changing completion date. Britons handled it professionally and adapted without drama. The team was experienced, careful and easy to deal with.",
    rating: 5
  },
  {
    id: 4,
    name: "Stephen T., Birmingham to Milan",
    text: "We used Britons for a part-load move to northern Italy. It was well coordinated, competitively priced and everything arrived in good condition. You could tell they do this kind of work regularly.",
    rating: 5
  }
];

export const FAQS: FAQItem[] = [
  {
    question: "Do you handle customs paperwork for Spain?",
    answer: "Yes, since Brexit, moving to Spain requires specific T1 or T2 customs documents. We manage the entire process, advising you on the necessary NIE/TIE residency requirements and duty-free import exemptions."
  },
  {
    question: "How long does a removal to Spain take?",
    answer: "A full house removal typically takes 3-5 days from loading to delivery depending on the destination region. Part loads depend on our weekly schedule but usually deliver within 7-14 days."
  },
  {
    question: "Are my goods insured for international transit?",
    answer: "Absolutely. We provide comprehensive Goods in Transit insurance specifically tailored for international relocations, covering sea crossings and road transit across Europe."
  }
];
