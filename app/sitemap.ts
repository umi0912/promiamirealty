import type { MetadataRoute } from "next";
import { LISTINGS, CITIES } from "@/lib/data";

const BASE = "https://promiamirealty.com";
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/search", "/city", "/services", "/buyers", "/sellers", "/investors", "/about", "/contact"].map(p => ({
    url: BASE + p, lastModified: new Date(), changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.8,
  }));
  const listings = LISTINGS.map(l => ({ url: `${BASE}/listings/${l.id}`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.7 }));
  const cities = CITIES.map(c => ({ url: `${BASE}/city/${c.slug}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 }));
  return [...pages, ...cities, ...listings];
}
