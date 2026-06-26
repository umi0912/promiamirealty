import { NextResponse } from "next/server";
import { getMarketStats, sparkEnabled } from "@/lib/spark";

// Статистика рынка для Sellers (active, медиана цены и $/sqft). Кэш через revalidate в sparkGet.
export async function GET() {
  if (!sparkEnabled()) return NextResponse.json({ stats: null });
  try {
    const stats = await getMarketStats();
    return NextResponse.json({ stats });
  } catch {
    return NextResponse.json({ stats: null });
  }
}
