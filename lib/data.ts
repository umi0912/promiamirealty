// Структура листинга повторяет ключевые поля Spark API / RESO Web API.
// При подключении живого фида эти данные заменяются ответом API — типы совпадают.
export type Listing = {
  id: string;
  price: number;
  address: string;
  city: string;
  state: string;
  zip: string;
  type: "Condo" | "Single Family" | "Townhouse" | "Land";
  typeKey: "condo" | "house" | "townhouse" | "land";
  status: string;            // "Active" | "Coming Soon" | "For Sale" — из Spark StandardStatus
  beds: number;
  baths: number;
  sqft: number;
  yearBuilt: number;
  lat: number;
  lng: number;
  featured?: boolean;
  investor?: boolean;        // помечен как инвест-объект (доходный)
  estRent?: number;          // оценочная месячная аренда (для подборки инвесторов)
  senior55?: boolean;        // 55+ senior community
  mlsId?: string;            // MLS# (ListingId из Spark)
  courtesy?: string;         // "Courtesy of {ListOfficeName}" — атрибуция IDX
  description: string;
  photos: string[];
};

export const LISTINGS: Listing[] = [
  {
    id: "1", price: 2150000, address: "800 S Pointe Dr #1801", city: "Miami Beach", state: "FL", zip: "33139",
    type: "Condo", typeKey: "condo", status: "For Sale", beds: 3, baths: 4, sqft: 2650, yearBuilt: 2016,
    lat: 25.7689, lng: -80.1384, featured: true,
    description: "Corner residence on the 18th floor with wraparound terrace, direct ocean and bay views, private elevator entry, and access to a full-service amenity deck.",
    photos: ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1400&q=80","https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=900&q=80","https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&q=80","https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&q=80"],
  },
  {
    id: "2", price: 1850000, address: "9 Island Ave #1204", city: "Miami Beach", state: "FL", zip: "33139",
    type: "Condo", typeKey: "condo", status: "For Sale", beds: 2, baths: 3, sqft: 1820, yearBuilt: 2012,
    lat: 25.7912, lng: -80.1469, featured: true,
    description: "Light-filled residence on Belle Isle with floor-to-ceiling glass, a chef's kitchen, and skyline views across Biscayne Bay.",
    photos: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&q=80","https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=80","https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=900&q=80"],
  },
  {
    id: "3", price: 1295000, address: "450 Alton Rd #2104", city: "Miami Beach", state: "FL", zip: "33139",
    type: "Condo", typeKey: "condo", status: "For Sale", beds: 3, baths: 3, sqft: 1980, yearBuilt: 2018,
    lat: 25.7745, lng: -80.1419, featured: true,
    description: "Bright corner residence on the 21st floor with floor-to-ceiling windows, a wraparound balcony, rooftop pool, fitness center, and 24-hour concierge.",
    photos: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1400&q=80","https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=900&q=80","https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&q=80"],
  },
  {
    id: "4", price: 1120000, address: "1000 West Ave #714", city: "Miami Beach", state: "FL", zip: "33139",
    type: "Condo", typeKey: "condo", status: "For Sale", beds: 2, baths: 2, sqft: 1290, yearBuilt: 2009,
    lat: 25.7831, lng: -80.1431, investor: true, estRent: 5200,
    description: "Renovated bayfront residence with an open layout, spa-style baths, and a resort-style pool deck steps from Lincoln Road.",
    photos: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1400&q=80","https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=900&q=80"],
  },
  {
    id: "5", price: 875000, address: "1788 NW 7th St", city: "Miami", state: "FL", zip: "33125",
    type: "Single Family", typeKey: "house", status: "For Sale", beds: 4, baths: 2, sqft: 2240, yearBuilt: 1998,
    lat: 25.7811, lng: -80.2311,
    description: "Updated single-family home with a gated entry, open kitchen, large backyard, and room for a pool in a central Miami location.",
    photos: ["https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1400&q=80","https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=900&q=80"],
  },
  {
    id: "6", price: 760000, address: "6420 SW 8th St", city: "Miami", state: "FL", zip: "33144",
    type: "Single Family", typeKey: "house", status: "For Sale", beds: 4, baths: 3, sqft: 2010, yearBuilt: 2004,
    lat: 25.7637, lng: -80.3045, investor: true, estRent: 4100,
    description: "Move-in ready home with a split floor plan, updated kitchen, two-car garage, and a covered patio.",
    photos: ["https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=1400&q=80","https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=900&q=80"],
  },
  {
    id: "7", price: 640000, address: "3325 SW 22nd St", city: "Miami", state: "FL", zip: "33145",
    type: "Single Family", typeKey: "house", status: "For Sale", beds: 3, baths: 2, sqft: 1640, yearBuilt: 1991,
    lat: 25.7501, lng: -80.2531, investor: true, estRent: 3600,
    description: "Charming home in Coral Gate with hardwood floors, a renovated kitchen, and a fenced yard with mature landscaping.",
    photos: ["https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1400&q=80","https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=900&q=80"],
  },
  {
    id: "8", price: 540000, address: "15420 SW 104th Ter", city: "Miami", state: "FL", zip: "33176",
    type: "Single Family", typeKey: "house", status: "For Sale", beds: 3, baths: 2, sqft: 1480, yearBuilt: 1985,
    lat: 25.6711, lng: -80.4123, investor: true, estRent: 3100,
    description: "Well-maintained home in a quiet neighborhood with a screened patio, updated roof, and a spacious lot.",
    photos: ["https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1400&q=80","https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=900&q=80"],
  },
  {
    id: "9", price: 425000, address: "2850 NE 2nd Ave", city: "Miami", state: "FL", zip: "33137",
    type: "Townhouse", typeKey: "townhouse", status: "For Sale", beds: 3, baths: 2, sqft: 1680, yearBuilt: 2010,
    lat: 25.8101, lng: -80.1899,
    description: "Modern townhouse with private entrance, updated kitchen, and two-car garage near Wynwood.",
    photos: ["https://images.unsplash.com/photo-1580587771525-78b9dba3b814?w=1400&q=80"],
  },
  {
    id: "10", price: 285000, address: "14500 SW 92nd Ave", city: "Miami", state: "FL", zip: "33186",
    type: "Land", typeKey: "land", status: "For Sale", beds: 0, baths: 0, sqft: 8800, yearBuilt: 0,
    lat: 25.6833, lng: -80.3333, senior55: true,
    description: "Vacant land in 55+ gated community, perfect for custom home build.",
    photos: ["https://images.unsplash.com/photo-1559027615-cd2628902d4a?w=1400&q=80"],
  },
  {
    id: "11", price: 995000, address: "7650 SW 58th Ave", city: "Miami", state: "FL", zip: "33143",
    type: "Single Family", typeKey: "house", status: "For Sale", beds: 4, baths: 3, sqft: 2450, yearBuilt: 2008,
    lat: 25.7289, lng: -80.2789, senior55: true,
    description: "Spacious home in prestigious 55+ active community with golf, tennis, and clubhouse.",
    photos: ["https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=1400&q=80"],
  },
];

export const AGENT = {
  name: "Ays Iziken",
  title: "Real Estate Professional",
  brokerage: "PRO MIAMI REALTY",
  license: "FL #3517956",
  phone: "(305) 766-5513",
  phoneRaw: "+13057665513",
  email: "info@promiamirealty.com",
  address: "3350 SW 148 Ave, Suite 110, Miramar, FL 33027",
  calendly: "https://calendly.com/promiamirealty-info/30min",
  google: "https://share.google/24EroHsbWthMJ7Y8l",
};

export const fmtPrice = (n: number) => "$" + n.toLocaleString("en-US");
export const fmtPriceShort = (n: number) =>
  n >= 1000000 ? "$" + (n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1) + "M" : "$" + Math.round(n / 1000) + "k";

// Города для отдельных лендингов (SEO + навигация по локациям)
export type City = {
  slug: string;
  name: string;
  tagline: { en: string; ru: string };
  blurb: { en: string; ru: string };
  photo: string;
  matchCities: string[]; // какие city из листингов сюда попадают
};

export const CITIES: City[] = [
  {
    slug: "miami", name: "Miami",
    tagline: { en: "The heart of South Florida", ru: "Сердце Южной Флориды" },
    blurb: { en: "From Brickell high-rises to single-family neighborhoods, Miami offers urban energy, beaches, and strong long-term value.", ru: "От небоскрёбов Brickell до семейных районов — Майами сочетает городскую энергию, пляжи и устойчивый рост стоимости." },
    photo: "https://images.unsplash.com/photo-1506966953602-c20cc11f75e3?w=1400&q=80",
    matchCities: ["Miami", "Miami Beach"],
  },
  {
    slug: "miami-beach", name: "Miami Beach",
    tagline: { en: "Waterfront living, world-famous", ru: "Жизнь у воды, всемирно известная" },
    blurb: { en: "Oceanfront condos, Art Deco charm, and a lifestyle that draws buyers and investors from around the world.", ru: "Кондо у океана, ар-деко и стиль жизни, который привлекает покупателей и инвесторов со всего мира." },
    photo: "https://images.unsplash.com/photo-1535498730771-e735b998cd64?w=1400&q=80",
    matchCities: ["Miami Beach"],
  },
  {
    slug: "miramar", name: "Miramar",
    tagline: { en: "Family-friendly Broward living", ru: "Семейный район Broward" },
    blurb: { en: "Newer communities, great schools, and space — a top choice for families looking for value in Broward County.", ru: "Новые районы, хорошие школы и простор — отличный выбор для семей, ищущих ценность в Broward." },
    photo: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1400&q=80",
    matchCities: ["Miramar"],
  },
  {
    slug: "hollywood", name: "Hollywood",
    tagline: { en: "Beaches and a classic boardwalk", ru: "Пляжи и классический променад" },
    blurb: { en: "A walkable beach town between Miami and Fort Lauderdale, mixing affordability with a laid-back coastal lifestyle.", ru: "Пляжный город между Майами и Форт-Лодердейлом — доступность и спокойный прибрежный стиль жизни." },
    photo: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1400&q=80",
    matchCities: ["Hollywood"],
  },
  {
    slug: "sunny-isles", name: "Sunny Isles Beach",
    tagline: { en: "Luxury oceanfront towers", ru: "Люксовые башни у океана" },
    blurb: { en: "High-end oceanfront condos and a strong investment market — Sunny Isles is one of South Florida's premium addresses.", ru: "Премиальные кондо у океана и сильный инвестиционный рынок — Sunny Isles один из престижных адресов Южной Флориды." },
    photo: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1400&q=80",
    matchCities: ["Sunny Isles Beach", "Sunny Isles"],
  },
  {
    slug: "boca-raton", name: "Boca Raton",
    tagline: { en: "Upscale living in Palm Beach County", ru: "Престижная жизнь в Palm Beach" },
    blurb: { en: "Golf, gated communities, and refined coastal living — Boca Raton is a magnet for buyers seeking quality and calm.", ru: "Гольф, закрытые сообщества и утончённая прибрежная жизнь — Boca Raton привлекает покупателей, ценящих качество и спокойствие." },
    photo: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1400&q=80",
    matchCities: ["Boca Raton"],
  },
];
