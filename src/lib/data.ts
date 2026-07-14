// Hive Estate — Buy-only data (Land + Apartments / Bungalows)

export type Category = "land" | "home";
export type FacingDirection =
  "East" | "West" | "North" | "North East" | "North West" | "South East" | "South" | "South West";

export type LandDetails = {
  naStatus: "NA" | "Non-NA";
  plotSize: string;
  surveyNumber: string;
  roadWidth: string; // e.g. "20 ft"
  roadType: "Asphalt" | "Concrete" | "Mud Road";
  electricity: boolean;
  waterConnection: boolean;
  drainage: boolean;
  boundary: boolean;
  facingDirection: FacingDirection;
  ownershipType: "Agricultural" | "Residential" | "Converted";
  googleMap: string;
  nearbyLandmarks: string;
  roadAccess: boolean;
  vastuCompliance: boolean;
};

export type Property = {
  id: string; // UUID or same as listingNumber
  listingNumber: string; // e.g. "L0101"
  title: string;
  slug: string;
  propertyType: "Apartment" | "Bungalow" | "NA Plot" | "Non-NA Plot";
  category: Category;
  price: number; // INR
  pricePerSqFt?: number;
  location: string;
  area: number; // sqft
  description: string;
  gallery: string[];
  latitude: number;
  longitude: number;
  contactNumber: string;
  whatsappNumber: string;
  verified: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;

  // Legacy/UI specific fields for backward compatibility
  locality: string;
  city: string;
  status: "Ready to Move" | "Under Construction" | "New Launch" | "Available";
  amenities: string[];
  tags: string[];
  premium?: boolean;
  postedBy: "Owner" | "Agent" | "Builder";
  postedDate: string;
  hiveVerified: boolean;

  // home fields
  bhk?: number;
  bathrooms?: number;
  parking?: number;
  furnishing?: "Furnished" | "Semi-Furnished" | "Unfurnished";
  age?: string;
  builder?: string;
  facingDirection?: FacingDirection;
  vastuCompliance?: boolean;

  // land fields
  land?: LandDetails;

  // To satisfy old 'facing' and 'image' usages
  facing?: FacingDirection;
  image?: string;
};

// ---------- Contact (easily configurable) ----------
export const HIVE_PHONE_DISPLAY = "+91 90000 00000";
const WA_NUMBER = "919000000000";
const TEL_NUMBER = "+919000000000";

export const telHref = `tel:${TEL_NUMBER}`;

export const waHrefFor = (p: Property) => {
  if (p.category === "land") {
    const msg = `Hello, I would like to enquire about the land "${p.title}" with Listing Number ${p.listingNumber}. Please share more details, price, exact location, availability and site visit timings.`;
    return `https://wa.me/${p.whatsappNumber || WA_NUMBER}?text=${encodeURIComponent(msg)}`;
  } else {
    const msg = `Hello, I would like to enquire about the property "${p.title}" with Listing Number ${p.listingNumber}. Please share more details, price, availability and site visit timings.`;
    return `https://wa.me/${p.whatsappNumber || WA_NUMBER}?text=${encodeURIComponent(msg)}`;
  }
};

// ---------- Localities & nearby ----------
export const LOCALITIES = [
  "Tilakwadi",
  "Vadgaon",
  "Shahapur",
  "Machhe",
  "Kanbargi",
  "Camp",
  "Hanuman Nagar",
  "Kakati",
  "Angol",
  "Mahantesh Nagar",
  "Rukmini Nagar",
  "Sadashiv Nagar",
] as const;

export const NEARBY: Record<string, string[]> = {
  Tilakwadi: ["Camp", "Shahapur", "Angol"],
  Shahapur: ["Tilakwadi", "Vadgaon", "Angol"],
  Vadgaon: ["Shahapur", "Machhe", "Angol"],
  Machhe: ["Vadgaon", "Kakati"],
  Kanbargi: ["Rukmini Nagar", "Mahantesh Nagar"],
  Kakati: ["Machhe"],
  "Rukmini Nagar": ["Kanbargi", "Mahantesh Nagar", "Sadashiv Nagar"],
  Camp: ["Tilakwadi", "Shahapur"],
  "Hanuman Nagar": ["Sadashiv Nagar", "Angol", "Mahantesh Nagar"],
  "Sadashiv Nagar": ["Hanuman Nagar", "Rukmini Nagar"],
  Angol: ["Sadashiv Nagar", "Hanuman Nagar", "Tilakwadi", "Shahapur"],
  "Mahantesh Nagar": ["Rukmini Nagar", "Hanuman Nagar", "Kanbargi"],
};

// ---------- Images ----------
const img = (id: string, w = 1200, h = 800) =>
  `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&auto=format&q=70`;

const HOME_IMGS = [
  "photo-1560518883-ce09059eeffa",
  "photo-1568605114967-8130f3a36994",
  "photo-1600585154340-be6161a56a0c",
  "photo-1600596542815-ffad4c1539a9",
  "photo-1580587771525-78b9dba3b914",
  "photo-1613490493576-7fde63acd811",
  "photo-1600607687939-ce8a6c25118c",
  "photo-1512917774080-9991f1c4c750",
  "photo-1600566753190-17f0baa2a6c8",
  "photo-1600585152220-90363fe7e115",
];

const LAND_IMGS = [
  "photo-1500382017468-9049fed747ef",
  "photo-1464822759023-fed622ff2c3b",
  "photo-1501436513145-30f24e19fcc8",
  "photo-1470770841072-f978cf4d019e",
  "photo-1502082553048-f009c37129b9",
  "photo-1416879595882-3373a0480b5b",
  "photo-1500382017468-9049fed747ef",
  "photo-1533587851505-d119e13fa0d7",
];

const AMENITIES = [
  "Lift",
  "Power Backup",
  "Security",
  "Gym",
  "Swimming Pool",
  "Club House",
  "Kids Play Area",
  "Garden",
  "CCTV",
  "Parking",
];
const BUILDERS = [
  "Hive Developers",
  "Belgaum Constructions",
  "Sahyadri Homes",
  "Green Vista Group",
  "Prestige North",
];

// ---------- Facing rotation (never randomly assign South) ----------
const SAFE_FACING: FacingDirection[] = [
  "East",
  "West",
  "North",
  "North East",
  "North West",
  "South East",
];

// ---------- Seed ----------
type HomeSeed = {
  subType: "Apartment" | "Bungalow";
  bhk: number;
  area: number;
  price: number;
  locality: string;
  premium?: boolean;
  featured?: boolean;
};
type LandSeed = {
  naStatus: "NA" | "Non-NA";
  area: number;
  price: number;
  locality: string;
  ownership: LandDetails["ownershipType"];
  featured?: boolean;
  forceSouth?: boolean;
};

const HOMES: HomeSeed[] = [
  {
    subType: "Apartment",
    bhk: 3,
    area: 1450,
    price: 8500000,
    locality: "Tilakwadi",
    featured: true,
  },
  {
    subType: "Bungalow",
    bhk: 4,
    area: 2800,
    price: 21500000,
    locality: "Sadashiv Nagar",
    premium: true,
    featured: true,
  },
  { subType: "Apartment", bhk: 2, area: 1100, price: 5200000, locality: "Shahapur" },
  { subType: "Apartment", bhk: 3, area: 1600, price: 9800000, locality: "Vadgaon", premium: true },
  { subType: "Apartment", bhk: 1, area: 620, price: 3200000, locality: "Camp" },
  {
    subType: "Bungalow",
    bhk: 4,
    area: 3200,
    price: 28500000,
    locality: "Hanuman Nagar",
    featured: true,
  },
  { subType: "Apartment", bhk: 3, area: 1550, price: 8900000, locality: "Angol" },
  { subType: "Bungalow", bhk: 3, area: 2100, price: 14500000, locality: "Rukmini Nagar" },
  { subType: "Apartment", bhk: 2, area: 1180, price: 5800000, locality: "Mahantesh Nagar" },
];

const LANDS: LandSeed[] = [
  {
    naStatus: "NA",
    area: 2400,
    price: 3600000,
    locality: "Tilakwadi",
    ownership: "Converted",
    featured: true,
  },
  {
    naStatus: "NA",
    area: 3600,
    price: 5400000,
    locality: "Vadgaon",
    ownership: "Residential",
    featured: true,
  },
  { naStatus: "Non-NA", area: 8000, price: 4200000, locality: "Kakati", ownership: "Agricultural" },
  { naStatus: "NA", area: 1800, price: 2700000, locality: "Shahapur", ownership: "Converted" },
  { naStatus: "NA", area: 2200, price: 3100000, locality: "Machhe", ownership: "Residential" },
  {
    naStatus: "NA",
    area: 3000,
    price: 4800000,
    locality: "Kanbargi",
    ownership: "Residential",
    featured: true,
  },
  { naStatus: "NA", area: 2000, price: 2900000, locality: "Rukmini Nagar", ownership: "Converted" },
  {
    naStatus: "NA",
    area: 2700,
    price: 4100000,
    locality: "Hanuman Nagar",
    ownership: "Residential",
    forceSouth: true,
  },
  {
    naStatus: "NA",
    area: 3200,
    price: 5600000,
    locality: "Sadashiv Nagar",
    ownership: "Converted",
  },
];

const listingNo = (i: number) => `L${String(101 + i).padStart(4, "0")}`;
const ROAD_TYPES: LandDetails["roadType"][] = ["Asphalt", "Concrete", "Mud Road"];
const ROAD_WIDTHS = ["15 ft", "20 ft", "30 ft", "40 ft", "60 ft"];

export const isVastuCompliant = (facing: FacingDirection | undefined) => facing !== "South";

let cursor = 0;
const homeProps: Property[] = HOMES.map((h, i) => {
  const id = listingNo(cursor++);
  const gallery = [
    HOME_IMGS[i % HOME_IMGS.length],
    HOME_IMGS[(i + 3) % HOME_IMGS.length],
    HOME_IMGS[(i + 6) % HOME_IMGS.length],
    HOME_IMGS[(i + 1) % HOME_IMGS.length],
  ].map((x) => img(x));
  const facingDirection = SAFE_FACING[i % SAFE_FACING.length];

  return {
    id,
    listingNumber: id,
    title: `${h.bhk} BHK ${h.subType} in ${h.locality}`,
    slug: `${h.bhk}-bhk-${h.subType.toLowerCase()}-${h.locality.toLowerCase()}`,
    propertyType: h.subType,
    category: "home",
    price: h.price,
    pricePerSqFt: Math.round(h.price / h.area),
    location: `${h.locality}, Belagavi, Karnataka`,
    locality: h.locality,
    city: "Belagavi",
    area: h.area,
    description: `A well-designed ${h.subType.toLowerCase()} located in the prime area of ${h.locality}, Belagavi. Excellent connectivity, quality construction, and access to schools, hospitals and shopping. Ideal for end-users and investors.`,
    gallery,
    image: gallery[0],
    latitude: 15.8497 + (Math.random() * 0.05 - 0.025),
    longitude: 74.4977 + (Math.random() * 0.05 - 0.025),
    contactNumber: TEL_NUMBER,
    whatsappNumber: WA_NUMBER,
    verified: true,
    hiveVerified: true,
    featured: !!h.featured,
    premium: h.premium,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: (["Ready to Move", "Under Construction", "New Launch"] as const)[i % 3],
    amenities: AMENITIES.slice(0, 6 + (i % 4)),
    tags: [h.subType, `${h.bhk} BHK`, h.locality, "Belagavi", "Buy"],
    postedBy: (["Owner", "Agent", "Builder"] as const)[i % 3],
    postedDate: `${(i % 20) + 1} days ago`,
    bhk: h.bhk,
    bathrooms: Math.max(1, h.bhk - 1),
    parking: (i % 3) + 1,
    furnishing: (["Furnished", "Semi-Furnished", "Unfurnished"] as const)[i % 3],
    age: i % 3 === 0 ? "0-1 years" : i % 3 === 1 ? "New" : "5-10 years",
    builder: BUILDERS[i % BUILDERS.length],
    facingDirection,
    facing: facingDirection,
    vastuCompliance: isVastuCompliant(facingDirection),
  };
});

const landProps: Property[] = LANDS.map((l, i) => {
  const id = listingNo(cursor++);
  const gallery = [
    LAND_IMGS[i % LAND_IMGS.length],
    LAND_IMGS[(i + 2) % LAND_IMGS.length],
    LAND_IMGS[(i + 4) % LAND_IMGS.length],
    LAND_IMGS[(i + 1) % LAND_IMGS.length],
  ].map((x) => img(x));
  const facingDirection: FacingDirection = l.forceSouth
    ? "South"
    : SAFE_FACING[i % SAFE_FACING.length];
  const subType = l.naStatus === "NA" ? "NA Plot" : "Non-NA Plot";

  return {
    id,
    listingNumber: id,
    title: `${subType} in ${l.locality}`,
    slug: `${subType.toLowerCase().replace(" ", "-")}-${l.locality.toLowerCase()}`,
    propertyType: subType,
    category: "land",
    price: l.price,
    pricePerSqFt: Math.round(l.price / l.area),
    location: `${l.locality}, Belagavi, Karnataka`,
    locality: l.locality,
    city: "Belagavi",
    area: l.area,
    description: `A ${subType.toLowerCase()} of ${l.area} sqft located in ${l.locality}, Belagavi. Suitable for ${l.ownership === "Agricultural" ? "farming and long-term investment" : "residential development"}. Clear title, ready for immediate purchase.`,
    gallery,
    image: gallery[0],
    latitude: 15.8497 + (Math.random() * 0.05 - 0.025),
    longitude: 74.4977 + (Math.random() * 0.05 - 0.025),
    contactNumber: TEL_NUMBER,
    whatsappNumber: WA_NUMBER,
    verified: true,
    hiveVerified: true,
    featured: !!l.featured,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "Available",
    amenities: [],
    tags: [subType, l.naStatus, l.locality, "Belagavi", "Land", "Plot"],
    postedBy: (["Owner", "Agent"] as const)[i % 2],
    postedDate: `${(i % 20) + 1} days ago`,
    facingDirection,
    facing: facingDirection,
    vastuCompliance: isVastuCompliant(facingDirection),
    land: {
      naStatus: l.naStatus,
      plotSize: `${l.area} sqft`,
      surveyNumber: `SY-${120 + i}/${(i % 9) + 1}${["A", "B", "C"][i % 3]}`,
      roadWidth: ROAD_WIDTHS[i % ROAD_WIDTHS.length],
      roadType: ROAD_TYPES[i % ROAD_TYPES.length],
      electricity: i % 5 !== 4,
      waterConnection: i % 4 !== 3,
      drainage: i % 3 !== 2,
      boundary: i % 2 === 0,
      facingDirection,
      ownershipType: l.ownership,
      googleMap: `https://maps.google.com/?q=15.8497,74.4977`,
      nearbyLandmarks: `Near ${l.locality} Main Road`,
      roadAccess: true,
      vastuCompliance: isVastuCompliant(facingDirection),
    },
  };
});

export const PROPERTIES: Property[] = [...homeProps, ...landProps];

// ---------- Helpers ----------
export const formatINR = (n: number) => {
  if (n >= 10000000) return `₹ ${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹ ${(n / 100000).toFixed(2)} L`;
  if (n >= 1000) return `₹ ${(n / 1000).toFixed(1)} K`;
  return `₹ ${n}`;
};

export const getProperty = (id: string) => PROPERTIES.find((p) => p.id === id);
export const byCategory = (c: Category) => PROPERTIES.filter((p) => p.category === c);

// Search: returns primary matches and nearby locality matches
export type SearchResult = { primary: Property[]; nearby: Property[]; matchedLocality?: string };

export const searchProperties = (items: Property[], q: string): SearchResult => {
  const query = q.trim().toLowerCase();
  if (!query) return { primary: items, nearby: [] };

  const matchedLocality = (LOCALITIES as readonly string[]).find(
    (l) => l.toLowerCase() === query || l.toLowerCase().includes(query),
  );

  if (matchedLocality) {
    const primary = items.filter((p) => p.locality === matchedLocality);
    const nearbyList = NEARBY[matchedLocality] ?? [];
    const nearby = items.filter((p) => nearbyList.includes(p.locality));
    return { primary, nearby, matchedLocality };
  }

  const primary = items.filter(
    (p) =>
      p.title.toLowerCase().includes(query) ||
      p.locality.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.tags.some((t) => t.toLowerCase().includes(query)) ||
      String(p.area).includes(query),
  );
  return { primary, nearby: [] };
};

// ---------- Legacy exports (kept so unrelated pages still compile) ----------
export const BUILDERS_LIST = BUILDERS.map((name, i) => ({
  id: `b-${i}`,
  name,
  projects: 6 + i * 2,
  completed: 12 + i * 3,
  city: "Belagavi",
  rating: (4.2 + (i % 5) * 0.1).toFixed(1),
  image: img(HOME_IMGS[(i + 3) % HOME_IMGS.length], 600, 400),
  about: `${name} is a trusted developer in Belagavi delivering quality residential projects with a focus on transparency and timely handover.`,
}));

export const AGENTS_LIST = [
  { id: "a-1", name: "Rohan Patil", experience: 8, rating: 4.8, deals: 120, locality: "Tilakwadi" },
  {
    id: "a-2",
    name: "Aishwarya Desai",
    experience: 6,
    rating: 4.7,
    deals: 95,
    locality: "Shahapur",
  },
  {
    id: "a-3",
    name: "Vinay Kulkarni",
    experience: 12,
    rating: 4.9,
    deals: 210,
    locality: "Sadashiv Nagar",
  },
  { id: "a-4", name: "Priya Naik", experience: 5, rating: 4.6, deals: 70, locality: "Camp" },
  { id: "a-5", name: "Sameer Joshi", experience: 10, rating: 4.8, deals: 160, locality: "Vadgaon" },
  { id: "a-6", name: "Neha Hegde", experience: 4, rating: 4.5, deals: 55, locality: "Nehru Nagar" },
].map((a, i) => ({
  ...a,
  image: img(HOME_IMGS[(i + 5) % HOME_IMGS.length], 400, 400),
  phone: HIVE_PHONE_DISPLAY,
}));

export const BLOGS = [
  {
    id: "1",
    title: "Top 10 Localities to Invest in Belagavi 2026",
    excerpt: "A data-backed look at the fastest growing neighborhoods in Belagavi.",
    date: "Jun 2026",
    image: img(HOME_IMGS[2], 800, 500),
  },
  {
    id: "2",
    title: "Home Loan Guide for First-Time Buyers",
    excerpt: "Everything you need to know about eligibility, EMIs and documents.",
    date: "May 2026",
    image: img(HOME_IMGS[5], 800, 500),
  },
  {
    id: "3",
    title: "NA vs Non-NA Land in Karnataka",
    excerpt: "Understand the difference before buying land in Belagavi.",
    date: "Apr 2026",
    image: img(LAND_IMGS[0], 800, 500),
  },
];
