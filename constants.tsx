
import React from 'react';
import { Truck, Globe, Box, Warehouse, Shield, Clock, CheckCircle, Ship } from 'lucide-react';
import { FAQItem, Testimonial } from './types';

export const COMPANY_INFO = {
  name: "Britons Removals & Storage",
  phone: "01332 208 008",
  email: "britons@me.com",
  address: "Unit 4, Little Chester Park, Alfreton Rd, Derby DE21 4AA, United Kingdom",
  website: "removaltospain.co.uk",
  spainExpertise: "40 years experience in removals to Spain, including Alicante, Malaga, Murcia, and Madrid."
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
    title: "Full House Removals",
    description: "Our flagship service for complete household relocations between the UK and Spain.",
    advantages: [
      "Exclusive use of vehicle for your belongings",
      "Direct door-to-door transit on your schedule",
      "Flexible loading and delivery dates",
      "Full customs clearance handling post-Brexit"
    ],
    process: "We start with a professional survey, provide a bespoke transit plan, handle all export documentation, and deliver directly to your Spanish or UK address."
  },
  {
    id: 'part-loads',
    icon: <Truck className="w-10 h-10 text-blue-600" />,
    title: "Part Load Services",
    description: "A cost-effective solution for smaller moves or single items sharing space on our weekly Spanish runs.",
    advantages: [
      "Significant cost savings on transit",
      "Regular weekly departures to all regions of Spain",
      "Same high-quality handling as full loads",
      "Ideal for holiday home furnishing"
    ],
    process: "Your items are professionally inventoried and shared with other consignments on our regular routes, reducing costs while maintaining safety."
  },
  {
    id: 'packing',
    icon: <Box className="w-10 h-10 text-blue-600" />,
    title: "Packing & Export Wrapping",
    description: "Professional packing services designed specifically for long-distance international transit.",
    advantages: [
      "Specialist export-grade materials used",
      "Fragile item protection (antiques, pianos)",
      "Reduces risk of damage during sea/land transit",
      "Unpacking service at your destination"
    ],
    process: "Our trained crew packs everything using multi-layered bubble wrap and heavy-duty cartons, ensuring every item is cataloged for customs."
  },
  {
    id: 'storage',
    icon: <Warehouse className="w-10 h-10 text-blue-600" />,
    title: "Secure Storage Solutions",
    description: "Safe, containerized storage available in both our UK (Derby) and Spanish depots.",
    advantages: [
      "24/7 CCTV and alarm monitoring",
      "Climate-controlled environments",
      "Short-term and long-term options",
      "Inventory-linked retrieval"
    ],
    process: "Goods are loaded directly into storage containers at your home, sealed, and stored in our secure warehouse until you are ready for delivery."
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Hamy Hanon",
    text: "Britons handled our move from Derby to Malaga perfectly. After Brexit, we were worried about paperwork, but they took care of everything. Highly recommended!",
    rating: 5
  },
  {
    id: 2,
    name: "Robert & Sheila Thompson",
    text: "The part-load service was brilliant for moving our garden furniture to our villa in Alicante. Professional, polite, and very well priced.",
    rating: 5
  },
  {
    id: 3,
    name: "John Davies",
    text: "Outstanding service. The packing team was efficient and treated our antiques with incredible care. The storage in Derby was a lifesaver during our chain delay.",
    rating: 5
  },
  {
    id: 4,
    name: "Elena Rodriguez",
    text: "Moved my entire apartment from Madrid to London. Excellent communication throughout. The drivers were very helpful and punctual.",
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
