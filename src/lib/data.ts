export type Property = {
  id: string;
  title: string;
  type: "Apartment" | "Villa" | "Plot" | "Commercial" | "Office" | "Warehouse";
  listing: "buy" | "rent" | "commercial" | "plots";
  price: number; // in INR
  pricePerSqft?: number;
  area: number; // sqft
  bhk?: number;
  bathrooms?: number;
  parking?: number;
  furnishing?: "Furnished" | "Semi-Furnished" | "Unfurnished";
  facing?: string;
  status: "Ready to Move" | "Under Construction" | "New Launch";
  age?: string;
  locality: string;
  city: string;
  builder?: string;
  postedBy: "Owner" | "Agent" | "Builder";
  postedDate: string;
  verified: boolean;
  featured: boolean;
  premium?: boolean;
  image: string;
  gallery: string[];
  description: string;
  amenities: string[];
};

const img = (id: string, w = 1200, h = 800) =>
  `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&auto=format&q=70`;

const IMGS = [
  "photo-1560518883-ce09059eeffa",
  "photo-1568605114967-8130f3a36994",
  "photo-1512917774080-9991f1c4c750",
  "photo-1600585154340-be6161a56a0c",
  "photo-1600596542815-ffad4c1539a9",
  "photo-1580587771525-78b9dba3b914",
  "photo-1613490493576-7fde63acd811",
  "photo-1600607687939-ce8a6c25118c",
  "photo-1502672260266-1c1ef2d93688",
  "photo-1493809842364-78817add7ffb",
  "photo-1600566753190-17f0baa2a6c8",
  "photo-1600585152220-90363fe7e115",
];

export const LOCALITIES = [
  "Tilakwadi", "Shahapur", "Vadgaon", "Angol", "Sadashiv Nagar",
  "Hanuman Nagar", "Mahantesh Nagar", "Nehru Nagar", "Udyambag",
  "Rukmini Nagar", "Camp", "Auto Nagar", "Khasbag", "Majagaon",
  "Kakati", "Hindalga", "Machhe", "Sambra", "Marihal", "Kanbargi",
];

const BUILDERS = ["Hive Developers", "Belgaum Constructions", "Sahyadri Homes", "Green Vista Group", "Prestige North"];

const AMEN = ["Lift", "Power Backup", "Security", "Gym", "Swimming Pool", "Club House", "Kids Play Area", "Garden", "CCTV", "Parking"];

const rand = <T,>(arr: T[], i: number) => arr[i % arr.length];

const seed: Array<Partial<Property> & { type: Property["type"]; listing: Property["listing"] }> = [
  { type: "Apartment", listing: "buy", bhk: 3, area: 1450, price: 8500000 },
  { type: "Villa", listing: "buy", bhk: 4, area: 2800, price: 21500000, premium: true },
  { type: "Apartment", listing: "buy", bhk: 2, area: 1100, price: 5200000 },
  { type: "Plot", listing: "plots", area: 2400, price: 3600000 },
  { type: "Apartment", listing: "rent", bhk: 2, area: 1050, price: 18000 },
  { type: "Villa", listing: "rent", bhk: 3, area: 2200, price: 45000 },
  { type: "Office", listing: "commercial", area: 900, price: 6500000 },
  { type: "Commercial", listing: "commercial", area: 1800, price: 12500000 },
  { type: "Apartment", listing: "buy", bhk: 3, area: 1600, price: 9800000, premium: true },
  { type: "Apartment", listing: "buy", bhk: 1, area: 620, price: 3200000 },
  { type: "Plot", listing: "plots", area: 3600, price: 5400000 },
  { type: "Warehouse", listing: "commercial", area: 5000, price: 22000000 },
  { type: "Villa", listing: "buy", bhk: 4, area: 3200, price: 28500000 },
  { type: "Apartment", listing: "rent", bhk: 3, area: 1500, price: 32000 },
  { type: "Apartment", listing: "buy", bhk: 2, area: 1200, price: 6100000 },
  { type: "Office", listing: "commercial", area: 1200, price: 8200000 },
  { type: "Apartment", listing: "buy", bhk: 3, area: 1550, price: 8900000 },
  { type: "Plot", listing: "plots", area: 1800, price: 2700000 },
];

export const PROPERTIES: Property[] = seed.map((s, i) => {
  const locality = rand(LOCALITIES, i * 3 + 1);
  const gallery = [rand(IMGS, i), rand(IMGS, i + 4), rand(IMGS, i + 7), rand(IMGS, i + 2)].map((x) => img(x));
  return {
    id: `HE-${1000 + i}`,
    title: `${s.bhk ? s.bhk + " BHK " : ""}${s.type} in ${locality}`,
    type: s.type,
    listing: s.listing,
    price: s.price!,
    pricePerSqft: s.listing !== "rent" ? Math.round(s.price! / s.area!) : undefined,
    area: s.area!,
    bhk: s.bhk,
    bathrooms: s.bhk ? Math.max(1, s.bhk - 1) : undefined,
    parking: s.type === "Plot" ? 0 : (i % 3) + 1,
    furnishing: s.listing === "rent" ? (["Furnished", "Semi-Furnished", "Unfurnished"] as const)[i % 3] : undefined,
    facing: (["East", "West", "North", "South", "North-East"] as const)[i % 5],
    status: (["Ready to Move", "Under Construction", "New Launch"] as const)[i % 3],
    age: i % 3 === 0 ? "0-1 years" : i % 3 === 1 ? "New" : "5-10 years",
    locality,
    city: "Belagavi",
    builder: rand(BUILDERS, i),
    postedBy: (["Owner", "Agent", "Builder"] as const)[i % 3],
    postedDate: `${(i % 20) + 1} days ago`,
    verified: i % 2 === 0,
    featured: i % 4 === 0,
    premium: !!s.premium,
    image: gallery[0],
    gallery,
    description: `A well-designed ${s.type.toLowerCase()} located in the prime area of ${locality}, Belagavi. Excellent connectivity, quality construction, and access to schools, hospitals and shopping. Ideal for ${s.listing === "rent" ? "families and professionals" : "end-users and investors"}.`,
    amenities: AMEN.slice(0, 6 + (i % 4)),
  };
});

export const BUILDERS_LIST = BUILDERS.map((name, i) => ({
  id: `b-${i}`,
  name,
  projects: 6 + i * 2,
  completed: 12 + i * 3,
  city: "Belagavi",
  rating: (4.2 + (i % 5) * 0.1).toFixed(1),
  image: img(rand(IMGS, i + 3), 600, 400),
  about: `${name} is a trusted developer in Belagavi delivering quality residential and commercial projects with a focus on transparency and timely handover.`,
}));

export const AGENTS_LIST = [
  { id: "a-1", name: "Rohan Patil", experience: 8, rating: 4.8, deals: 120, locality: "Tilakwadi" },
  { id: "a-2", name: "Aishwarya Desai", experience: 6, rating: 4.7, deals: 95, locality: "Shahapur" },
  { id: "a-3", name: "Vinay Kulkarni", experience: 12, rating: 4.9, deals: 210, locality: "Sadashiv Nagar" },
  { id: "a-4", name: "Priya Naik", experience: 5, rating: 4.6, deals: 70, locality: "Camp" },
  { id: "a-5", name: "Sameer Joshi", experience: 10, rating: 4.8, deals: 160, locality: "Vadgaon" },
  { id: "a-6", name: "Neha Hegde", experience: 4, rating: 4.5, deals: 55, locality: "Nehru Nagar" },
].map((a, i) => ({ ...a, image: img(rand(IMGS, i + 5), 400, 400), phone: "+91 90000 00000" }));

export const BLOGS = [
  { id: "1", title: "Top 10 Localities to Invest in Belagavi 2026", excerpt: "A data-backed look at the fastest growing neighborhoods in Belagavi.", date: "Jun 2026", image: img(IMGS[2], 800, 500) },
  { id: "2", title: "Home Loan Guide for First-Time Buyers", excerpt: "Everything you need to know about eligibility, EMIs and documents.", date: "May 2026", image: img(IMGS[5], 800, 500) },
  { id: "3", title: "Ready to Move vs Under Construction", excerpt: "How to choose the right property type for your goals.", date: "Apr 2026", image: img(IMGS[9], 800, 500) },
];

export const formatINR = (n: number) => {
  if (n >= 10000000) return `₹ ${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹ ${(n / 100000).toFixed(2)} L`;
  if (n >= 1000) return `₹ ${(n / 1000).toFixed(1)} K`;
  return `₹ ${n}`;
};

export const getProperty = (id: string) => PROPERTIES.find((p) => p.id === id);
export const byListing = (l: Property["listing"]) => PROPERTIES.filter((p) => p.listing === l);
