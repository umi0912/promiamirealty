import { getListings, sparkEnabled } from "@/lib/spark";
import { type Listing, LISTINGS } from "@/lib/data";
import HomeClient from "./HomeClient";

// ISR: страница пересобирается раз в час, featured тянутся на сервере (надёжно, без мерцания).
export const revalidate = 3600;

// «Signature residences» — премиум-дома из live MLS; demo-fallback если Spark недоступен.
async function getFeatured(): Promise<Listing[]> {
  if (sparkEnabled()) {
    try {
      const r = await getListings({ status: "active", typeKey: "house", minPrice: 1500000, pageSize: 12, page: 1 });
      const withPhoto = r.listings.filter(l => l.photos[0] && !l.photos[0].includes("unsplash"));
      if (withPhoto.length >= 7) return withPhoto.slice(0, 7);
      if (r.listings.length) return r.listings.slice(0, 7);
    } catch { /* fallback ниже */ }
  }
  return [...LISTINGS.filter(l => l.featured), ...LISTINGS.filter(l => !l.featured)].slice(0, 7);
}

export default async function Page() {
  const featured = await getFeatured();
  return <HomeClient featured={featured} />;
}
